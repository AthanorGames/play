# Ground materials

Drop a **square, seamless** texture in here named for the terrain it
covers and the map will lay it flat on the ground plane instead of
drawing that terrain's dithered pixel face:

    assets/materials/plains.jpg
    assets/materials/forest.jpg
    assets/materials/highlands.jpg
    assets/materials/desert.jpg
    assets/materials/tundra.jpg
    assets/materials/swamp.jpg
    assets/materials/wasteland.jpg
    assets/materials/broken.jpg
    assets/materials/water.jpg

The name must match a `TerrainType` exactly (`lib/src/models/terrain.dart`);
anything else in this folder — this file included — is ignored. Any
terrain without a material here keeps its generated face, so the two can
be mixed while a set is being filled in.

**The full set ships.** All nine are filled in — see CREDITS.md for which
ambientCG asset each one is, and why water is generated rather than
downloaded. Replacing one is a matter of dropping a new file over it.

Trees are **not** part of the ground and are drawn over it
(`_tree` in `map_painter.dart`), because a forest material is a forest
*floor* — swapping the dithered face for one would otherwise leave a
forest looking like bare dirt.

**Use the Color/albedo map only.** Nothing here samples normal,
roughness, AO or displacement: the map draws a flat 2D diamond, so those
channels have nothing to light. Downloading the 1K JPG Color map is
enough, and the smallest one that still reads at map zoom is the right
choice — every byte here ships in the web bundle and in all three APKs.

One repeat spans `materialTilesPerRepeat` tiles (8, in
`map_painter.dart`), and the shader is built in world coordinates, so the
texture runs continuously across tile edges rather than restarting on
each diamond. It must therefore **tile seamlessly**, or the seam will
show as a grid.

**Contrast matters more than fidelity.** A truthful photograph of smooth
sand or clean snow has almost no local variation — ambientCG's Ground093C
spans a dozen grey levels and Snow010A fewer — and at map zoom that is a
painted rectangle, not ground. `desert.jpg` and `tundra.jpg` are those
photographs with their *local* variation pulled up to roughly the spread
the other eight already had (std ≈ 13–15), leaving the average colour
alone: still that sand, only legible. Anything you drop in here wants a
grey-channel std in the low teens; measure before trusting your eye on a
512px thumbnail.

Sources and licences are recorded in `CREDITS.md` — read the Meshy
section before adding a model, because ownership there depends on both
the plan and the inputs.

## Making one

The set here was generated through `model_workflows/` (prompts in
`prompts/ground/`) and made tileable by `tool/make_seamless.py`, which
also reports whether it worked:

```sh
cd model_workflows && scripts/run_workflow.py workflows/api/txt2img_qwen.json \
    --prompt "$(cat prompts/ground/plains.txt)" \
    --negative "$(cat prompts/ground/_negative.txt)" \
    --set width=1328 --set height=1328 --set Save.filename_prefix=ground/plains
tool/make_seamless.py model_workflows/output/ground/plains_00001_.png \
    --out assets/materials/plains.jpg --check
```

Three things learned making this set, each of which cost a round trip:

- **A ground texture wants fine detail and NO large shapes.** The first
  attempt asked for an interesting picture of grassland and got sweeping
  arcs, which tile into obvious wallpaper at eight repeats across the
  map. The prompts ask for "the same density everywhere, no focal
  point, like a close macro crop of a much larger surface".
- **Look at it tiled 2x2, not just at the number.** A seam repair that
  mirrored the strip scored a perfect 0.98 and produced a butterfly
  through the middle of every tile.
- **Trust the absolute seam figure on a smooth texture.** `water.jpg`
  scores 2.06 by the ratio and its edges differ by 2.1 levels out of
  255. Acting on the ratio, the tool "repaired" it into something worse.
  It is the original, and it is fine.

## Why these are 512

Feature size on screen is `feature's share of the texture x the repeat
in pixels`, and the repeat is `materialTilesPerRepeat x 64`. Texture
resolution does not come into it: all a bigger texture buys is
sharpness, and only up to about one texel per screen pixel.

So the two numbers have to be chosen together. At eight tiles to a
repeat a leaf came out the size of a soldier. Dropping to three fixed
the scale and made everything soft, because a 1024 texture squeezed
into 192 device pixels is a five-to-one minification. Four tiles to a
repeat with a 512 texture is 256 device pixels against 512 texels — the
scale reads right and the detail survives. It is also a quarter of the
bundle weight.
