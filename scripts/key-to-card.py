"""Compose a raw studio generation into a card-ready product image.

This mirrors how the Fresh For Summer cards on the home page were built, which
is the look we want: the subject is measured, scaled to a fixed share of the
card height and sat on the card's bottom edge, so every product reads at the
same size with the same headroom no matter how the generator framed the shot.

It depends on the source being framed head-to-mid-thigh: the head clear of the
top with space either side, the thighs running off the bottom. A head or a
shoulder touching an edge means the frame cut through the model, the measured
box is not what we think it is, and scaling from it would make that one card
the odd one out - so those are rejected for reshooting rather than silently
producing a mismatched card.
"""
from PIL import Image
from scipy import ndimage
import numpy as np, sys, os

CARD = (238, 238, 238)      # #eee, the product card background
W, H = 604, 800             # 2x the 302x400 card, ratio 0.755
FIGURE_H = 0.925            # subject height as a share of the card
NEAR, FAR = 10.0, 30.0      # backdrop feather band, in colour distance
SUBJECT = 24.0              # colour distance that counts as subject
MIN_RUN = 0.010             # share of a row that must be subject to count
EDGE = 3                    # px of margin required on every side
STRAY = 2000                # px: a detached shape bigger than this is not a stray mark


class BadFraming(Exception):
    """The source frame cuts through the subject, so it cannot be measured."""


def backdrop_rows(a: np.ndarray) -> np.ndarray:
    """Backdrop colour per row, read from the strips down the left and right
    edges. A single sample from the top corners is not enough: some studios
    light the seamless unevenly, so the backdrop beside the hips can be
    several levels lighter than the backdrop beside the head. Remapping all of
    it against one colour then leaves a faint panel across the middle of the
    card. The side strips are backdrop on every frame that passes the guards,
    which reject a body running off a side."""
    k = max(4, a.shape[1] // 25)
    sides = np.concatenate([a[:, :k], a[:, -k:]], axis=1)
    rows = np.median(sides, axis=1)                     # (h, 3)
    # Smooth vertically so one row crossing an arm cannot shift the estimate.
    pad = np.pad(rows, ((8, 8), (0, 0)), mode="edge")
    kern = np.ones(17) / 17
    return np.stack([np.convolve(pad[:, c], kern, "valid") for c in range(3)], axis=1)


def subject_box(d: np.ndarray):
    """Bounding box of the model. A row counts only if a meaningful run of it
    is subject, so specks and faint gradients cannot define the box."""
    m = d > SUBJECT
    h, w = m.shape
    rows = np.where(m.sum(axis=1) > max(10, MIN_RUN * w))[0]
    cols = np.where(m.sum(axis=0) > max(10, MIN_RUN * h))[0]
    if not len(rows) or not len(cols):
        return None
    return cols[0], rows[0], cols[-1], rows[-1]


def compose(src: str, dst: str, strict: bool = True) -> int:
    im = Image.open(src).convert("RGB")
    a = np.asarray(im)
    src_a = a.astype(np.float32)
    h, w = a.shape[:2]

    # Measure against the per-row backdrop too, not just remap against it. A
    # frame lit with a vignette has corners several levels darker than the
    # middle, so a single corner sample makes the whole picture read as
    # subject and a perfectly good shot gets thrown out.
    rows_bg = backdrop_rows(src_a)
    bg = np.median(rows_bg, axis=0)
    # A row whose side strips are far from that is a row where the body runs
    # off the side, so its estimate is the body, not the backdrop. Fall back to
    # the global colour there, and count the rows: enough of them means the
    # frame genuinely cuts the model off at the side.
    off_side = np.abs(rows_bg - bg).max(axis=1) > SUBJECT
    rows_bg[off_side] = bg
    d = np.abs(src_a - rows_bg[:, None, :]).max(axis=2)

    # The generator sometimes draws a stray interface mark into the backdrop - a
    # watermark circle in a corner, an avatar dot beside the hip. Left alone it
    # drags the measured box out to that corner and shrinks the model on the
    # card, and it survives into the finished picture.
    #
    # A mark is a shape that stands clear of the model: it does not touch her
    # and it falls entirely outside the space she occupies. Loose hair, a tie
    # end and a sheer hem also come back as separate shapes, but they sit
    # within her bounds, so bounding the test that way keeps them. A small mark
    # is wiped, since the backdrop is about to be flattened anyway; a large one
    # means something is in the frame that should not be there, and the frame
    # goes back for a reshoot.
    lab, n = ndimage.label(d > SUBJECT)
    if n > 1:
        areas = np.bincount(lab.ravel())[1:]
        main = int(np.argmax(areas)) + 1
        rows, cols = np.where(lab == main)
        top_m, bot_m, left_m, right_m = rows.min(), rows.max(), cols.min(), cols.max()
        for i, area in enumerate(areas, start=1):
            if i == main:
                continue
            r, c = np.where(lab == i)
            if top_m <= r.min() and r.max() <= bot_m and left_m <= c.min() and c.max() <= right_m:
                continue                      # inside her bounds: part of the look
            if area > STRAY:
                raise BadFraming(src)
            d = np.where(lab == i, 0.0, d)

    box = subject_box(d)
    if box is None:
        raise BadFraming(src)

    left, top, right, bottom = box
    if strict:
        # These look for the frame genuinely cutting through the model, not
        # for a stray pixel: a faint vignette reads as a thin smear down a
        # whole edge, and hair grazing the top is not a cropped head. The
        # thresholds are set from measured good and bad frames.
        m = d > SUBJECT
        if off_side.sum() > 0.45 * h:
            raise BadFraming(src)          # body running off a side
        # The crown must be clear of the top. Hair reaching the edge is a
        # cropped head on the card, so the tolerance here is only wide enough
        # for a few stray pixels, not for a band of hair.
        if m[0].sum() > 0.02 * w:
            raise BadFraming(src)
        # The thighs must run off the bottom. A shot that stops short is a
        # full-length frame, whose box spans head-to-ankle rather than
        # head-to-thigh, and scaling by it would render that model smaller
        # than every other card.
        if bottom < h - EDGE:
            raise BadFraming(src)
        # A crown starts narrow and widens into the head. If the subject is
        # already near body width in its very first rows, the frame has cut
        # straight across the head - which happens a little below the edge as
        # often as at it, so an edge test alone misses it. Measured across
        # known frames: intact 0.06-0.14, cut 0.39-0.41.
        widths = m.sum(axis=1)
        crown = float(np.median(widths[top:top + 8]))
        body = float(np.percentile(widths[top:bottom], 90))
        if body and crown / body > 0.25:
            raise BadFraming(src)

    # Remap while the source is still at its own scale, against the same
    # per-row backdrop the measurement used.
    t = np.clip((FAR - d) / (FAR - NEAR), 0, 1)[..., None]         # 1 on the backdrop
    flat = src_a * (1 - t) + np.array(CARD, dtype=np.float32) * t
    im = Image.fromarray(flat.astype(np.uint8))

    scale = (FIGURE_H * H) / (bottom - top + 1)
    im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)

    canvas = Image.new("RGB", (W, H), CARD)
    canvas.paste(im, (round(W / 2 - (left + right) / 2 * scale),   # centred on the subject
                      round(H - (bottom + 1) * scale)))            # sat on the bottom edge
    canvas.save(dst, "JPEG", quality=82, optimize=True, progressive=True)
    return os.path.getsize(dst) // 1024


if __name__ == "__main__":
    try:
        print(compose(sys.argv[1], sys.argv[2]), "KB")
    except BadFraming:
        print(f"REJECTED (frame cuts the subject): {sys.argv[1]}")
        sys.exit(3)
