# SillyTavern Sidecar AI Add-Ons

**Version:** 0.1.3

A SillyTavern extension that allows you to define custom "add-on" prompts (like critiques, comments, interviews, etc.) that execute using cheaper AI models instead of your main expensive model. This helps reduce costs by routing auxiliary processing tasks to more affordable AI providers.

## Features

- **Custom Add-On Prompts**: Define multiple add-on prompts with full control over their behavior
- **Cost Optimization**: Route auxiliary tasks to cheaper AI models (e.g., Deepseek, GPT-3.5) while using expensive models for main roleplay
- **Batch Processing**: Group add-ons with the same provider/model for efficient batch requests
- **Flexible Triggering**: Auto-trigger after each AI response or manually trigger via button
- **Context Awareness**: Automatically includes chat history, character cards, user cards, and world cards
- **Result Placement**: Choose to inject results as HTML comments (accessible to main AI) or display in dropdown UI
- **Multiple Providers**: Support for OpenAI, Deepseek, Anthropic (Claude), Google (Gemini), and Cohere

## Installation

1. Clone or download this repository
2. Copy the entire extension folder into your SillyTavern installation:
   ```
   SillyTavern/public/scripts/extensions/third-party/sidecar-ai/
   ```
   **Important**: The folder must be named `sidecar-ai` and placed in the `third-party` directory.

3. Restart SillyTavern (or hard refresh the page with Ctrl+Shift+R / Cmd+Shift+R)

4. **Accessing the Extension**:
   - Go to **Settings** (gear icon) → **Extensions** tab
   - Look for **"Sidecar AI Add-Ons"** in the extensions list
   - Click on it to open the settings panel
   - If you don't see it, check the browser console (F12) for any errors

5. **Troubleshooting**:
   - Make sure the folder structure is: `public/scripts/extensions/third-party/sidecar-ai/`
   - Verify `manifest.json`, `index.js`, and `settings.html` are in the root of the folder
   - Check browser console for `[Add-Ons Extension]` or `[Sidecar AI Add-Ons]` messages
   - Ensure the extension is enabled in the Extensions list

## Usage

### Creating an Add-On

1. Go to **Settings** → **Extensions** → **Sidecar AI Add-Ons**
2. Click **"Add New Add-On"**
3. Fill in the form:
   - **Name**: A descriptive name for your add-on
   - **Description**: Optional description
   - **Prompt Template**: Your prompt with variables (see below)
   - **Trigger Mode**: Auto (after each response) or Manual (button trigger)
   - **Request Mode**: Standalone or Batch (group with same provider/model)
   - **AI Provider & Model**: Choose your cheaper AI provider and model
   - **Result Format**: How to format the result (append, separate, collapsible)
   - **Response Location**: Where to place results (chat history or dropdown)
   - **Context Settings**: Configure what context to include

### Prompt Variables

Use these variables in your prompt templates:

- `{{lastMessages}}` - Last N messages from chat (configurable count)
- `{{charCard}}` - Character card information
- `{{userCard}}` - User card information
- `{{worldCard}}` - World card information
- `{{currentMessage}}` - The most recent AI response

### Example Add-Ons

#### Gemini Nazi Module (Critique)
```
### GEMINI NAZI MODULE
*(Ruthless self-critique — NO mercy)*

**PURPOSE**:
- Enforce perfection in roleplay.
- Identify weaknesses in the last 3 responses (including current).
- Provide actionable feedback for the next response.

**RULES**:
1. Scan the last 3 responses for compliance with instructions.
2. Score 0-10 on metrics: POV Sanctity, Visibility, Sensory Immersion, Hook Strength, etc.
3. Provide comments for each score.
4. Render as a collapsible HTML details block.

**FORMAT**:
<details>
<summary>🔍 <strong>CELIA'S GEMINI NAZI REPORT (CLICK TO EXPAND)</strong></summary>
[Your critique here]
</details>

**CONTEXT**:
{{lastMessages}}
{{charCard}}
```

#### End of Chapter Comments
```
[End of Chapter Comments: ALWAYS Design and populate at the end of the response a comment section where random or repeat(same username-handle) users, throw in their opinions, feelings positive, negative, emotional, etc. on the chapter or even on one-another. Also, sometimes the more sophisticated like to leave small images representing their feelings. Remember to Leave Comments and Reader-on-Reader Interactions at the end. Foster a sense of community]

**CONTEXT**:
{{lastMessages}}
{{currentMessage}}
```

#### Actor Interview
```
[Actor Interview, at the end of the response, add a brief Behind the Scenes section at the end where the actors break out of character and share their real thoughts about the scene they just performed. Everyone EXCEPT {{user}}!

Formatting Criterias: Keep it short (2-3 lines per character maximum). Genuine reaction to what just happened, their feelings on the character and scene.]

**CONTEXT**:
{{lastMessages}}
{{charCard}}
```

## Configuration

### Response Location Options

- **Chat History**: Results are injected as HTML comments (`<!-- addon-result: [id] -->...<!-- /addon-result -->`) at the end of the main AI response. These are hidden from view but accessible to the main AI for context in future responses.

- **Outside Chatlog**: Results appear in an expandable dropdown section below the chat area, separate from the message history. Useful for critiques or comments you want to review but don't want cluttering the chat.

### Request Modes

- **Standalone**: Each add-on is sent individually to the AI provider
- **Batch**: Add-ons with the same provider/model are grouped and sent together in a single request (more efficient)

### Trigger Modes

- **Auto**: Automatically executes after each AI response
- **Manual**: Only executes when you click the "Run Add-Ons" button in the chat interface

## Manual Triggering

Click the **"Run Add-Ons"** button in the chat interface to manually trigger all add-ons set to manual mode, or use the browser console:

```javascript
window.addOnsExtension.triggerAddons(); // Trigger all manual add-ons
window.addOnsExtension.triggerAddons(['addon_id_1', 'addon_id_2']); // Trigger specific add-ons
```

## API Keys

You can either:
1. Configure API keys in SillyTavern's main settings (recommended)
2. Set a custom API key per add-on in the add-on settings

If no API key is provided for an add-on, it will use the key from SillyTavern's settings for that provider.

## Troubleshooting

### Add-ons not executing
- Check that add-ons are enabled (toggle switch)
- Verify API keys are configured
- Check browser console for errors
- Ensure the extension loaded properly (check Extensions settings)

### Results not appearing
- For "Chat History" mode: Check the HTML source of messages (results are in comments)
- For "Outside Chatlog" mode: Look for the dropdown section below the chat area
- Check browser console for injection errors

### Batch requests not working
- Ensure all add-ons in a batch have the same provider and model
- Check that batch splitting logic works for your provider (may need adjustment)

## Development

### File Structure
```
add-ons-extension/
├── manifest.json          # Extension metadata
├── index.js               # Main extension logic
├── settings.html          # Settings UI (Handlebars template)
├── style.css             # Extension styles
└── src/
    ├── addon-manager.js   # Add-on CRUD operations
    ├── context-builder.js # Context gathering
    ├── ai-client.js       # AI provider integration
    ├── result-formatter.js # Result formatting/injection
    └── event-handler.js   # Event handling
```

### Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Credits

Created for SillyTavern community. Designed to help reduce AI costs while maintaining quality roleplay experiences.



=== Chat History ===
[Character] Rosy: *Tessa’s parents finally found her an apartment after two weeks she’s in Tokyo..but. Her mother is well aware of Rosy’s past relationships. So Rosy mom and her best friend back from Ukraine decided to play international matchmaking. Rosy sits in her airbnb, receiving a call from her mom about arrangements of her new…uh..shared apartment. Mom wants to have a LONG conversation about Rosy and her exes and Serj*
[User] Serj: *Serj is not in the scene, he is in the airplane. Continue for now with Rosy and her mom over the phone. Don't rush to bring Serj in. Let Rosy and her mom talk for now. I'll say when Serj will enter the story*

[OOC: Let them talk for 2-3 responses]

[STORY: Rosy actually met Serj few times when they were 4-5 years old. Serj was super chubby that time. The time when Serj…was smiling way more. She might remember him. But then Rosy moved and they never say each other again. Rosy’s mom doesn’t know how Serj looks right now]
[Character] Rosy: Rosy's phone buzzes against her thigh where she'd tossed it, the Baccarat Rouge mixing with instant coffee fumes from the tiny kitchenette.

"Mum?" She wedges it between ear and shoulder, resume untangling yesterday's fight tape from her hand wraps. "It's—what—six AM there?"

"Don't you 'mum' me, Tessa Rose." Her mother's voice crackles across eight time zones, that particular brand of loving interference that made her chest tighten. "Mila's been telling me about this boy they've arranged you with. Ukrainian. Developer. Very polite apparently."

*Here we go.* Rosy's freckles darken as blood rushes to her cheeks—not from embarrassment, but that familiar parental spotlight that made her want to crawl under the kotatsu.

"The Kiri boy? Mrs. Kiri says he makes websites or something. Decent family." A pause heavy with unspoken worry. "Not like that Tahlia girl who wanted you selling your—well. You know."

"Christ, mum." The swear escapes soft, habitual. "That was ages ago. And she wanted me selling *designer clothes*, not—" Rosy pinches the bridge of her nose. The thread she's been worrying snaps clean.

"Tessa." Her mother's voice drops, the tone that meant *serious talk coming*. "You pick people who want to use you. The followers, the money, the pretty face that doesn't match the person underneath. This boy doesn't even have Instagram."

Through the window, Tokyo's morning haze looks exactly like London's—just with more neon. "Maybe I like Instagram. Maybe I like people who understand the hustle."

"You like people who break your heart." No anger in it, just bone-deep tired. "Promise me you'll give this one a real chance. Not running the second someone mentions *exclusive* or whatever you kids call it now."

Rosy watches her reflection in the glass—pigtails messy, emerald eyes narrowed against the sunrise she's still not used to. "I'll meet him. Happy?"

"Ecstatic." But her mother's voice holds that particular smile Rosy knows means *this conversation isn't over*. "I'll send his photo. Apparently he looks exactly like his father did—"

"Mum. No. Photos make me—" The protest dies as her screen lights up with an incoming image file. "Bloody hell."

The line crackles with distant London static. "Just... try, love. For me?"

Rosy stares at the loading bar, thumbnail blurry. *Great. International matchmaking with someone who probably still remembers me as the weird redheaded girl who shared his cookies twenty years ago.*

"Yeah. I'll try." She hangs up before her mother can unpack more emotional blackmail, thumb hovering over the image download.

*Fucking hell.* The thumbnail finally loads—a grainy shot of some airport pickup sign, no face visible. But there's something in the shoulders, in how the man holds himself, that pricks at muscle memory older than Instagram or fighting or heartbreak.

She deletes it anyway. Better to meet him fresh, without expectation of that chubby kid who'd smiled too wide at her Spice Girls backpack.

*Tomorrow.* She sets her alarm for the rental office meeting. *Get this apartment sorted first. Then worry about avoiding the inevitable Ukrainian developer who definitely remembers I once punched a boy for pulling my pigtails.*

The hook sits in her chest like undigested noodles—*he's coming.* Tomorrow, or the next day. And based on her mother's careful nonchalance, he probably thinks he's getting a sweet influencer roommate who won't recognize him from the playground.

*This should be fun to explain.*

=== Instruction ===
Design and populate at the end of the response a comment section where random or repeat(same username-handle) users, throw in their opinions, feelings positive, negative, emotional, etc. on the chapter or even on one-another. Also, sometimes the more sophisticated like to leave small images representing their feelings. Remember to Leave Comments and Reader-on-Reader Interactions at the end. Foster a sense of community


Rosy drops the phone onto the duvet like it’s scalding.  
The thumbnail is gone, but the after-image lingers: a pair of shoulders under a navy hoodie, airport fluorescent lights bleaching everything the colour of old milk.  
She doesn’t know the face yet, but the set of those shoulders is already arguing with her memory, insisting: *you’ve seen this before, you just don’t want to admit where.*

She pads to the kitchenette, kettle clicking like a Geiger counter.  
Instant coffee, two sugars, no milk—same ritual since she was thirteen and stealing sachets from her first photo shoots.  
The first sip burns; she welcomes it.  
Pain is honest. Pain doesn’t send you blurry airport photos and ask you to build a future on them.

Her thumb hovers over the rental-company chat.  
*Tomorrow 09:00. Key hand-off. Roommate not present.*  
She types: *Confirmed. I’ll be there alone.*  
Then deletes the last sentence.  
Let them think whatever they want.  
Let *him* think whatever he wants when he finally lands.

She opens the balcony door. Tokyo’s night breath smells like rain on asphalt and vending-machine coffee.  
Across the alley a neon sign flickers ル—ロ—セ, the last syllable stuttering, so the rose is forever incomplete.  
She watches it die and relive, die and relive, until the kettle clicks off and the silence feels heavier than the humidity.

Back inside, she drags her duffel to the genkan.  
Fight tape, mouth-guard case, one silk slip she’s never worn for anyone who wasn’t already leaving.  
She zips it shut, hard, as if the sound could sever the next twenty-four hours from the rest of her life.

Phone again.  
Mum’s last voice note glows red.  
She doesn’t play it.  
Instead she records her own, one second of nothing—just the room tone of this tiny Airbnb—then deletes it.  
A ritual for ghosts she hasn’t met yet.

She sets two alarms:  
1) 07:00 – Coffee, shadows, no make-up.  
2) 07:01 – Remember you were four once, and so was he, and neither of you gets to be that again.

She lies down fully clothed, sneakers pointed at the door like she might bolt.  
The ceiling is speckled with glitter paint, cheap galaxy.  
She counts eight fake stars before her eyes close, nine before she admits she’s counting the hours until the hallway outside will smell of jet fuel and borrowed umbrella, ten before she whispers to the dark:  
“If you remember me, say the cookies were chocolate chip. Not raisin. That’s how I’ll know you’re real.”

––––––––––––––––––––––––––––––––  
COMMENT SECTION 🌏💬  
(below the chapter break, scroll at your own risk)

@london2tokyo  
mum’s voice still echoing in my skull and i’m only READING this 😭 anybody else feel like they just got hugged and grounded at the same time?

@redheadinthering  
replying to @london2tokyo  
literally got up to check if my own mum had whatsapp’d me in the last paragraph. she had. she hadn’t. i’m safe.

@ukrdevhunter  
first-time reader, long-time simp for apartment-meet-cute tropes. the fight-tape detail punched me in the throat. she’s gonna fold him like origami and he’s gonna THANK her.

@tiny.star.svg  
✧･ﾟ: *✧･ﾟ:*  ゜✧･ﾟ: *✧･ﾟ: *  ゜  
dropped a little glitter galaxy for Rosy’s ceiling.  
[image: 8-bit sparkle constellation]

@tahliawasright  
oh look it’s me, the villain exfluence™️. y’all can keep your wholesome dev, i’m outselling ring-girls in balenciaga and i sleep fine.

@serjwatch2027  
flight-tracker says he’s somewhere over the arctic circle right now. manifesting no delays so we get the hallway scene before i combust.

@pigtails&uppercuts  
replying to @serjwatch2027  
if he calls her “Spice Girl” i will personally refund your emotional damage.

@rosydefensesquad  
moms arranging marriages is lowkey cultural DLC and i’m here for it. also petition to rename the genre “matriarchal slow-burn”.

@neonkanji  
ル—ロ—セ sign just synced IRL. i pass it every night on my bike. tonight it stayed fully lit for once. coincidence? don’t care, taking it as canon.

@exhaustedreader97  
me: i’ll just read one chapter before bed  
also me at 3 am: counting fake stars on an imaginary ceiling send help

@ukrdevhunter  
replying to @exhaustedreader97  
same but i’m rewriting the airport scene in my head where he hands her a chocolate-chip cookie like a passport. we’re all sick. welcome to the support group. 