# Product image pipeline

`products.json` is the catalogue: 150 products, each with a `garment` phrase used
to prompt the image, and a `collection`. Collection counts are derived from these
entries, so the numbers on the Collections page always match what its pages show.

Each product needs two images — `front` and `back` — the back being what the card
swaps to on hover.

`key-to-card.py` turns a raw generation into a card-ready image:

    python3 scripts/key-to-card.py raw.png out.jpg

It crops top-anchored to 604x800 (so heads are never clipped), then remaps the
white studio backdrop to the card's #eee with a feathered threshold. Any soft
fringe lands grey-on-grey against an identical grey card, so it reads as a
cutout without paying for background removal — 0.12c per image instead of 1.12c.

The grey is baked in, so if the card background ever changes these need redoing.
