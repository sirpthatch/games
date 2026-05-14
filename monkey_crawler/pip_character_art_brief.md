# Character Art Brief: Pip the Brass-Hearted

**Project:** [Game Title TBD]
**Role:** Player character / hero
**Tone:** Cute, whimsical, adventurous
**Last updated:** May 2026

---

## One-line description

A small, friendly robotic monkey with a screen for a face, a heart-shaped window in his chest revealing tiny working gears, and a wind-up key on his back — finished in soft rose-pink with mint-teal accents.

## Reference touchpoints

- **Proportions / charm:** Astro Bot, Kirby, Sackboy
- **Robot-as-toy feel:** Wall-E and EVE, the robots in *Wallace & Gromit*, vintage tin wind-up toys
- **Screen-face expression style:** EVE (Wall-E), BMO (Adventure Time), Vector (Despicable Me)
- **Material warmth:** Studio Ghibli automatons (Castle in the Sky, Howl's), Laika stop-motion props
- **What to avoid:** sharp edges, military/industrial feel, glowing neon, photorealism, anything Chuck E. Cheese animatronic-uncanny

---

## Proportions (the silhouette is the whole job)

Head-to-body ratio is roughly **1 : 0.9** — head is dominant. Read this character as "big head, small everything else." Specific ratios, head-height as the unit:

| Part | Size |
|---|---|
| Head | 1.0 H |
| Torso | 0.7 H tall, 0.85 H wide |
| Arms (each) | 1.3 H long, thin — should reach below the knee when relaxed |
| Legs | 0.4 H — stubby, bottom-heavy stance |
| Tail | 1.4 H long when uncurled, prehensile, normally curled in a loose spiral |
| Total height standing | ~2.1 H |

The **arms must be visibly longer than the legs** — this is what reads "monkey" before any other detail. The tail does the second-most silhouette work; never crop or hide it in hero shots.

## Form language

- Rounded, chunky panels with visible **seams and rivets** — never smooth/seamless. He's clearly *built*, not molded.
- Joints are **ball-and-socket** style at shoulders, hips, neck, and tail base. Visible as small spheres in a contrasting darker tone.
- Hands are **three-fingered** (two fingers + opposable thumb), large enough to grip a banana, ledge, or tool.
- Feet are **rounded paddle-shapes** with a visible weight underneath — think dive boots, not articulated toes.
- No belly button, no mouth-as-hole, no separated jaw. The face is a **single rectangular screen** with rounded corners.

## Face

- **Screen** is matte black or very dark charcoal, slightly inset into the head (small bevel/frame visible around it).
- **Eyes** are two glowing circles of soft mint-teal light, with a small white highlight off-center. Pupils can scale and move within the screen for expression — they're light, not pasted-on.
- **Mouth** is a single curved line of the same mint-teal — present but minimal. Animatable as smile, frown, "o," flat line, etc.
- The screen should feel **alive and warm**, not glitchy or computer-monitor-cold. No scanlines, no pixelation.
- **Ears** are two oval external panels on the sides of the head with a smaller mint disc in the center (like a speaker grille or a second small "eye").

## Signature elements (these are the merch/icon hooks — keep them prominent)

1. **Heart-shaped chest window** — a clear/glass cutout in the torso plate, framed in deeper magenta. Inside: a small cluster of tiny working brass-and-rose-gold gears, slowly turning. This is the character's "soul." It can dim when he's hurt, brighten when he's powered up, and the gears can spin faster when he's excited. **This is the #1 iconic element.**
2. **Wind-up key** on the upper back, between the shoulder blades. Small, brass-colored, classic squared-loop shape. Visible from behind and three-quarter angles. Implies he needs to be cared for / wound up — narrative hook.
3. **Antenna** with a tiny mint-teal sphere on top, sticking up from the crown of the head. Short — about a quarter of the head's height. It can wiggle as a secondary animation channel.

## Color palette (lock these — they're the brand)

| Use | Color | Hex |
|---|---|---|
| Primary body panels | Rose pink | `#E890B5` |
| Secondary / face plate / belly | Blush cream | `#FCE0EC` |
| Joints, accents, deeper shadows | Magenta | `#D46A98` |
| Outline / linework / deep shadow | Plum | `#8F3A66` |
| Screen base | Near-black | `#2A2A2A` |
| Eyes / mouth / antenna tip / ear discs / heart-window glow | Mint teal | `#3AA8A0` |
| Wind-up key, internal gears | Warm brass | `#C8A06A` |

**Rule:** mint teal is the only accent color — use it sparingly so it always reads as "alive" (eyes, mouth, signature lights). If everything is mint, nothing is.

**Lighting:** soft, warm, top-down with a gentle key light. No harsh rim lights, no neon glow, no chromatic aberration. The character should look like a well-loved toy on a sunlit shelf.

## Material notes

- Body panels: **matte plastic or enameled metal** with a slight satin sheen. Not glossy, not chalky.
- Joints and inner mechanisms: brushed brass, slightly dulled with age — he's a treasured object, not factory-new.
- Heart window: clean glass, a very faint warm reflection, gears clearly visible inside.
- Tail: same panels as body, segmented every ~15% of length so it can curl naturally.

## Personality readout (so the artist knows what he's "thinking")

Pip is **earnest, brave, and slightly clumsy**. He's the kind of hero who tries first and thinks second, who hugs before high-fiving. Default expression at rest: gentle smile, eyes slightly upturned, head tilted ~5° to one side — curious about the world. Default pose: weight on one foot, opposite hand scratching the back of the head OR holding the tail in front of him like a question mark.

He should never look smug, sarcastic, or knowing. If you can't tell whether your pose reads as *brave* or *cocky* — it's cocky. Redo it.

## Required deliverables (suggested)

- **Hero pose** — three-quarter front, neutral standing, eye-line slightly raised. The marketing key art.
- **Turnaround** — front, three-quarter, profile, three-quarter back, back. Reference for the modeler/rigger.
- **Expression sheet** — at minimum: happy, surprised, determined, sad, sleepy, sparkly-eyed (excited). All driven by the screen, no head-shape changes.
- **Action poses (3)** — running, hanging by one arm from a ledge, curled up in a roll/ball.
- **Damage states (3)** — fresh, scuffed (small dents, slightly dimmer heart), critical (one panel missing, heart gears barely turning, antenna bent).

## Technical constraints

- Output for game use: **PNG with transparent background**, lossless.
- Sizes needed: **512×512, 1024×1024, 2048×2048** for the hero pose; smaller variants for UI (128, 64, 32 — verify silhouette still reads at 32).
- Rig-friendly: separable head, torso, arms (upper/lower/hand), legs (upper/lower/foot), tail (segmented). Avoid poses where limbs cross the torso in ways that would be hard to layer.
- Outline weight: 2–3 px at 1024px scale, in plum (`#8F3A66`). Consistent throughout.

## Prompt seed (for image-gen tools)

> *"Cute robotic monkey character, rose-pink and blush cream paneled body, mint-teal glowing eyes on a small dark screen-face, heart-shaped glass window in chest revealing tiny brass gears, brass wind-up key on back, short antenna with mint tip, oversized rounded head, long thin arms, stubby legs, curled prehensile tail, three-quarter view, soft warm lighting, flat painterly illustration, Studio Ghibli meets vintage tin toy, transparent background, character concept art, full body."*

Iterate by adjusting: pose, expression, lighting angle, level of detail in the gears, presence/absence of accessories.

---

## Things NOT to change without checking back

- Color palette (locked — these are the brand colors)
- Three signature elements: heart window, wind-up key, antenna
- Screen-face (no sculpted features)
- Head:body ratio (~1:0.9)
- Three-fingered hands

Everything else is open to artistic interpretation.
