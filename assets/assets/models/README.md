# Scanned models — the preview bench

Decimated Meshy exports, kept here so the work of producing them is not
lost and so the **Models** button on the main menu has something to show.
**Nothing in this folder is used by the game yet**: only
`ModelPreviewScreen` reads it, and a shipping build should drop the whole
folder — see the note in `pubspec.yaml`.

## What is here

| Prefix | Subjects | Atlas |
|---|---|---|
| `lord_` | the eight guild Lords | `atlas_lords.jpg` (1024px) |
| `build_` | seven buildings | `atlas_alchemical.jpg` (2048px) |
| `beast_` | five creatures — all of `CreatureKind` | `atlas_alchemical.jpg` |
| `item_` | seven of the eight drawn arms | `atlas_weapons.jpg` (2048px) |
| `unit_` | the four class figures | `atlas_unit_<name>.jpg` (512px each) |
| `homunculus_` | three variants, a/b/c | `atlas_homunculus.jpg` (1024px) |

Every subject cut from one sheet shares that sheet's atlas, which is why
there are a handful of atlases and rather more models. The homunculi are
three because the game raises them by the dozen, and which one a unit
wears is read off its id — a rank of them should not be one figure
repeated. The prefix is what
`ModelPreviewScreen._atlasFor` keys off, so a new model needs either a
matching prefix or a line in that method.

## How they were made

    tool/decimate_meshy.py --faces 12000 --texture 512 \
        warrior:concept_art/warrior_obj.zip

    tool/split_sheet.py "concept_art/Hero sheet_obj.zip" \
        --faces 12000 --texture 1024 --min-faces 3000 \
        --names panacea,aether,mercury,aurum,salt,vitriol,entropy,sulfur

**10–12k faces is the floor.** Below it the large flat panels go first,
which is why a cloaked figure falls apart at 4k while a coated one
survives; above it nothing improves at the size these are drawn.

The OBJs here are then stripped of `vn` lines and cut to four decimals
(five for UVs), which halves them: the draw path computes flat normals
itself, so shipped normals are dead weight.

## Two things that will bite

**A sheet's 3D layout need not match its reference PNG.** `split_sheet.py`
emits subjects in the order they sit in the *scene*, and on the
alchemical sheet that is not the order they appear in
`concept_art/alchemical asset sheet.png`. The names were checked by eye
against a render, one at a time. Do that again for any new sheet rather
than trusting the order.

**`goldMine` and `reagentMine` are the one pair not fully confirmed** —
both are purple-lit mountain mines and they were told apart by the rail
structure. Worth a second look before either is used.

## Not here

The **crossbow** is absent from `weapons base_obj.zip`: the split finds
seven components at any threshold, so it was never generated.
Accessories have not been generated either.

The homunculus sheet also carries a **throwable health potion**, which is
the `thrown` item type the arms sheet lacks. It was deliberately left
out here — say so before adding it, since it is the one asset that would
arrive without a matching model beside it.

Sources and licences — including why the Meshy plan matters — are in
`CREDITS.md`.
