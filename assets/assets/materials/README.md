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

**Use the Color/albedo map only.** Nothing here samples normal,
roughness, AO or displacement: the map draws a flat 2D diamond, so those
channels have nothing to light. Downloading the 1K JPG Color map is
enough, and the smallest one that still reads at map zoom is the right
choice — every byte here ships in the web bundle and in all three APKs.

One repeat spans `materialTilesPerRepeat` tiles (4, in
`map_painter.dart`), and the shader is built in world coordinates, so the
texture runs continuously across tile edges rather than restarting on
each diamond. It must therefore **tile seamlessly**, or the seam will
show as a grid.

Sources and licences are recorded in `CREDITS.md` — read the Meshy
section before adding a model, because ownership there depends on both
the plan and the inputs.
