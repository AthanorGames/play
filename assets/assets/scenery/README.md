# Painted battlefield props

Trees, scrub, bones and stones, generated in `/asset-engine` with
Qwen-Image (Apache-2.0) through `workflows/api/preset_concept_prop.json`,
and cut out by `tool/cut_prop.py` — a flood fill from the corners of a
plain background, so no matting model is involved, and nothing here
touches Hunyuan.

Each file is a square RGBA canvas with the prop's lowest pixel on the line
0.92 of the way down (`SpriteStore.paintedPropFoot`), centred across.

A file is picked up by its name:

- `scn_<key>.png` replaces that scenery key's startup-baked model
  (`scn_fir`, `scn_broadleaf`, `scn_bush`, `scn_scrub`, `scn_snag`,
  `scn_stump`, `scn_reeds`, `scn_cactus`, `scn_dunegrass`, `scn_bones`,
  `scn_cairn`, `scn_snowtuft`, `scn_ashheap`). Spelt exactly as the game
  keys them — all lower case — not as the engine's concept files are
  named (`scn_duneGrass_00001_.png`): a name off by one capital is
  silently ignored, and `test/scenery_assets_test.dart` is what notices.
- `rock_<shape>_<stone>.png` is a country's boulder: shape `small`,
  `cluster` or `spire`; stone `grey`, `mossy` (swamp, water), `sandstone`
  (desert), `frost` (tundra) or `basalt` (wasteland).

Anything not painted falls back to the baked primitive, so a missing file
costs a picture, never a launch. This README is ignored.

## Where each file came from

Each prop was cut with `tool/cut_prop.py` from a generated image under
`/asset-engine/output/athanor_props/`. To cut one again, use the source and
flags listed; a blank means the defaults (flood fill 60, pocket 30). The
tolerances differ per prop on purpose — a grey stone on a grey ground needs a
gentle cut that would leave background between a fir's needles — so a re-cut
at the defaults is not the same file.

The two sandstone entries marked *reroll* came from a second run that wrote
to the same names as the main batch; ComfyUI numbers files in the order they
finish, so those numbers are the ones that run's own log reported.

| Prop | Source image | Cut flags | Note |
|---|---|---|---|
| `scn_fir` | `scn_fir_00002_.png` | | second take: the first stood on a patch of moss |
| `scn_broadleaf` | `scn_broadleaf_00001_.png` | | |
| `scn_bush` | `scn_bush_00001_.png` | | |
| `scn_scrub` | `scn_scrub_00001_.png` | | a dark-ground reroll hollowed it; this is the light-ground take |
| `scn_snag` | `scn_snag_00001_.png` | | |
| `scn_stump` | `scn_stump_00001_.png` | | |
| `scn_reeds` | `scn_reeds_00001_.png` | | |
| `scn_dunegrass` | `scn_duneGrass_00001_.png` | | |
| `scn_cairn` | `scn_cairn_00001_.png` | | |
| `scn_cactus` | `scn_cactus_00002_.png` | | rerolled on grey: a white ground left specks down its spines |
| `scn_bones` | `scn_bones_00001_.png` | `--pocket-tol 15` | the default pocket step streaked the long bones |
| `scn_ashheap` | `scn_ashHeap_00001_.png` | | |
| `scn_snowtuft` | `scn_snowTuft_00004_.png` | `--tol 35 --pocket-tol 15` | fourth take: three stood on a square of snowy ground |
| `rock_small_grey` | `rock_small_grey_00002_.png` | | second take: the first sat on a disc of shadow |
| `rock_small_mossy` | `rock_small_mossy_00001_.png` | | |
| `rock_small_frost` | `rock_small_frost_00001_.png` | `--tol 20 --pocket-tol 8` | the default cut took chunks out of grey stone on grey |
| `rock_small_sandstone` | `rock_small_sandstone_00002_.png` | | rerolled with muted wording: the first was a saturated orange |
| `rock_small_basalt` | `rock_small_basalt_00001_.png` | | |
| `rock_cluster_grey` | `rock_cluster_grey_00001_.png` | | |
| `rock_cluster_mossy` | `rock_cluster_mossy_00001_.png` | | |
| `rock_cluster_frost` | `rock_cluster_frost_00001_.png` | `--tol 20 --pocket-tol 8` | |
| `rock_cluster_sandstone` | `rock_cluster_sandstone_00001_.png` | | *reroll* |
| `rock_cluster_basalt` | `rock_cluster_basalt_00001_.png` | | |
| `rock_spire_grey` | `rock_spire_grey_00001_.png` | | |
| `rock_spire_mossy` | `rock_spire_mossy_00001_.png` | | |
| `rock_spire_sandstone` | `rock_spire_sandstone_00001_.png` | | *reroll* |
| `rock_spire_frost` | `rock_spire_frost_00001_.png` | `--tol 20 --pocket-tol 8` | the default cut holed its face and snow cap |
| `rock_spire_basalt` | `rock_spire_basalt_00001_.png` | | |
