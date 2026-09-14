# Music

Every track here was generated for this game with **ACE-Step 1.5** (the
turbo model). Its weights are MIT-licensed, and its model card allows
commercial use of the music it makes. None of these files comes from
MusicGen, which made the score they replace: its weights are CC BY-NC 4.0.

They were made in the asset engine (`/asset-engine`) with
`workflows/api/txt2music_acestep15.json`, text encoders on the CPU, run by
`scripts/generate_music.py`, and cut into seamless loops by
`scripts/make_loop.py`: each loop starts and ends where the level and the
rhythm agree, and never holds a silence from its take. The ambient tracks were
made without ACE-Step's planner. The menu and battle tracks were made with it,
and with a section script, after the first set made without it was rejected
by ear. The columns below are the loop tool's measurements of the shipped
file.

The prompt files are kept in the asset engine, in `prompts/examples/music`, each with its
whole caption. To make these again, copy that folder out, and from
`/asset-engine`:

```sh
cp -r prompts/examples/music my_music
scripts/generate_music.py my_music --takes 4 --loop out/music --keep-best
```

The shipped seed of every track is in the table. On the same setup the same
seed should give the same take; `out/music/picks.json` then holds every take's
measurements.

| File | Used for | Music | Planner | Seed, picked | Loop, from the take | LUFS | Loudness range | True peak | Level at the restart |
|---|---|---|---|---|---|---|---|---|---|
| `intro.mp3` | Main menu | 68 bpm, 3/4, A minor | on | 2, by ear | 111 s, from 24 to 140 s of 150 | -16.0 | 11.6 LU | -1.7 dBTP | +0.4 dB |
| `select.mp3` | New game: choosing your lord | 68 bpm, 3/4, A minor | on | 1, by ear | 64 s, from 51 to 120 s of 150 | -16.0 | 8.5 LU | -1.7 dBTP | -0.2 dB |
| `battle_1.mp3` | Tactical battles (one of two, at random) | 132 bpm, 4/4, E minor | on | 3, by ear | 92 s, from 33 to 128 s of 150 | -14.0 | 2.9 LU | -1.2 dBTP | +0.0 dB |
| `battle_2.mp3` | Tactical battles (one of two, at random) | 132 bpm, 4/4, E minor | on | 2, by ear | 85 s, from 38 to 126 s of 150 | -14.0 | 3.0 LU | -2.3 dBTP | -0.1 dB |
| `entropy_1.mp3` | Entropy's blighted ground (one of three) | 60 bpm, 4/4, B minor | off | 3, by measurement | 168 s, from 9 to 185 s of 200 | -16.0 | 7.8 LU | -1.9 dBTP | -0.0 dB |
| `entropy_2.mp3` | Entropy's blighted ground (one of three) | 56 bpm, 4/4, F minor | off | 1, by measurement | 102 s, from 57 to 168 s of 200 | -16.1 | 8.0 LU | -1.8 dBTP | -0.1 dB |
| `entropy_3.mp3` | Entropy's blighted ground (one of three) | 64 bpm, 4/4, C# minor | off | 4, by measurement | 148 s, from 15 to 170 s of 200 | -16.0 | 9.6 LU | -1.5 dBTP | +0.1 dB |
| `ambient_plains.mp3` | World map: plains and desert | 92 bpm, 4/4, G major | off | 2, by measurement | 133 s, from 44 to 181 s of 200 | -16.2 | 5.7 LU | -1.5 dBTP | -0.0 dB |
| `ambient_forest.mp3` | World map: forest and swamp | 78 bpm, 4/4, E minor | off | 2, by measurement | 165 s, from 26 to 197 s of 210 | -16.0 | 4.1 LU | -0.7 dBTP | -0.1 dB |
| `ambient_highlands.mp3` | World map: highlands and broken ground | 84 bpm, 4/4, A minor | off | 3, by measurement | 139 s, from 13 to 158 s of 195 | -16.0 | 7.6 LU | -1.7 dBTP | +0.2 dB |
| `ambient_tundra.mp3` | World map: tundra | 66 bpm, 4/4, F# minor | off | 4, by measurement | 138 s, from 41 to 187 s of 200 | -16.0 | 8.1 LU | -3.6 dBTP | +0.2 dB |
| `ambient_water.mp3` | World map: water | 72 bpm, 6/8, Bb major | off | 3, by measurement | 131 s, from 0 to 142 s of 200 | -16.0 | 6.7 LU | -1.9 dBTP | -0.8 dB |

"Level at the restart" is the bars after the loop comes round against the
bars before its crossfade. "Picked by ear" means the take was chosen by
listening from every take of its prompts; "by measurement" means the take the
measurements preferred, kept after listening.

## Captions

**`intro.mp3`** (made from the prompt written for `select.mp3`): Fantasy chamber music, candlelit and warm, a solo cello melody over a continuous harp and lute accompaniment in a gentle waltz sway, soft sustained strings throughout, intimate, high-fidelity recording. Instrumental soundtrack for a fantasy strategy game, made to loop: it keeps one steady intensity from start to finish.

Section script: `[Main Theme - cello over harp and lute]`, `[Variation - lute melody over harp]`, `[Main Theme - cello and strings over harp]`, `[Variation - lute and harp]`, `[Main Theme - cello over harp and lute]`

**`select.mp3`**: Fantasy chamber music, candlelit and thoughtful, a warm solo cello melody over harp and lute arpeggios in a gentle waltz sway, soft strings, intimate, high-fidelity recording. Instrumental soundtrack for a fantasy strategy game, made to loop: it keeps one steady intensity from start to finish.

Section script: `[Main Theme - cello over harp and lute]`, `[Variation - lute melody]`, `[Main Theme - cello and soft strings]`, `[Variation - harp]`, `[Main Theme - cello over harp and lute]`

**`battle_1.mp3`**: Epic orchestral battle music, heroic and relentless, pounding war drums and a snare ostinato, driving staccato strings, bold brass calls, punchy, powerful, polished cinematic mix. Instrumental soundtrack for a fantasy strategy game, made to loop: it keeps one steady intensity from start to finish.

Section script: `[Battle Theme - drums and staccato strings]`, `[Brass Calls - high energy]`, `[Battle Theme - full orchestra]`, `[Brass Calls - high energy]`, `[Battle Theme - drums and staccato strings]`

**`battle_2.mp3`** (made from the prompt written for `battle_1.mp3`): Epic orchestral battle music, heroic and relentless, pounding war drums and a snare ostinato, driving staccato strings, bold brass calls, punchy, powerful, polished cinematic mix. Instrumental soundtrack for a fantasy strategy game, made to loop: it keeps one steady intensity from start to finish.

Section script: `[Battle Theme - drums and staccato strings]`, `[Brass Calls - high energy]`, `[Battle Theme - full orchestra]`, `[Brass Calls - high energy]`, `[Battle Theme - drums and staccato strings]`

**`entropy_1.mp3`**: Dark ambient: an ominous, creeping soundscape for a blighted wasteland, built on a continuous low drone that sustains throughout. Detuned bowed metal and a slow, dissonant cello line move over it above a steady, muffled pulse, cold and unsettling. Instrumental background score for a fantasy strategy game about rival alchemist guilds, made to loop: an even, steady piece that holds one intensity from start to finish, with a clean, warm, cinematic mix.

**`entropy_2.mp3`**: Dark ambient: a decaying, hollow soundscape of corrupted land. A slow, unbroken heartbeat pulse on a muffled bass drum over a continuous bed of grinding low strings and eerie glassy textures, heavy and constant. Instrumental background score for a fantasy strategy game about rival alchemist guilds, made to loop: an even, steady piece that holds one intensity from start to finish, with a clean, warm, cinematic mix.

**`entropy_3.mp3`**: Dark ambient: a tense, smouldering soundscape beside a dark furnace, built on a constant low furnace rumble and a sustained brass and cello drone that carries through the whole piece. A slow, steady pulse on a muffled deep drum and a dark metallic shimmer woven through it, oppressive and patient. Instrumental background score for a fantasy strategy game about rival alchemist guilds, made to loop: an even, steady piece that holds one intensity from start to finish, with a clean, warm, cinematic mix.

**`ambient_plains.mp3`**: Pastoral fantasy: open, sunlit music for crossing wide grasslands. Acoustic guitar and hammered dulcimer, a gentle wooden flute melody, soft string pads and a light hand drum, hopeful and unhurried. Instrumental background score for a fantasy strategy game about rival alchemist guilds, made to loop: an even, steady piece that holds one intensity from start to finish, with a clean, warm, cinematic mix.

**`ambient_forest.mp3`**: Enchanted forest: mysterious woodland exploration music. Plucked harp and kalimba, a low alto flute, soft string swells and gentle wooden percussion, calm and curious. Instrumental background score for a fantasy strategy game about rival alchemist guilds, made to loop: an even, steady piece that holds one intensity from start to finish, with a clean, warm, cinematic mix.

**`ambient_highlands.mp3`**: Highland fantasy: windswept mountain music. A solemn low whistle melody over a drone, frame drum, bowed cello and wide string chords, lonely but proud. Instrumental background score for a fantasy strategy game about rival alchemist guilds, made to loop: an even, steady piece that holds one intensity from start to finish, with a clean, warm, cinematic mix.

**`ambient_tundra.mp3`**: Frozen tundra: cold, glassy music for an icy wilderness, built on a continuous deep drone and sustained high strings that carry through the whole piece. Crystalline bells and soft piano notes with long reverb drift over them, slow, still and even. Instrumental background score for a fantasy strategy game about rival alchemist guilds, made to loop: an even, steady piece that holds one intensity from start to finish, with a clean, warm, cinematic mix.

**`ambient_water.mp3`**: Seafaring fantasy: gentle ocean voyage music with a lilting, swaying feel. A steady, continuous bed of low strings and soft marimba in an unbroken rocking rhythm, with harp arpeggios and a distant horn melody on top, calm and vast. Instrumental background score for a fantasy strategy game about rival alchemist guilds, made to loop: an even, steady piece that holds one intensity from start to finish, with a clean, warm, cinematic mix.
