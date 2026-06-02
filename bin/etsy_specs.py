import sys; sys.path.insert(0, "bin")
from etsybuild import build

P = []

P.append({"file":"01_ai-chief-of-staff.pdf","kicker":"The Solo Founder Series","footer":"AI Chief of Staff",
 "title":"Build Your AI Chief of Staff",
 "subtitle":"Turn any AI assistant into a chief of staff that runs your day, protects your focus, and never forgets your context.",
 "blocks":[
  ("h1","Why a chief of staff, not a chatbot"),
  ("p","Most people use AI like a vending machine: ask, answer, forget. A chief of staff holds your goals, sets your plan, remembers every decision, and keeps you moving when you stall. Build one in an afternoon, no code."),
  ("callout","The shift","You stop managing the AI. The AI starts managing the work — and surfaces only what needs your decision."),
  ("h1","The 4 pillars"),
  ("h2","1. Context that follows you"),
  ("p","One living document your AI reads at the start of every session: North Star, active projects, decisions made, and a running log of what just happened."),
  ("check",["Write your North Star (the one outcome that matters)","List active projects + their current goal","Record decisions as you make them","End each session by logging what changed"]),
  ("h2","2. A role contract"),
  ("p","Tell your AI who it is to you and give it standing orders: drive the plan, protect commitments, reduce decisions not effort, treat unshipped work as not done."),
  ("callout","Copy-paste prompt","“You are my chief of staff. Each morning set my top 1-3 tasks toward [GOAL]. When I bring new ideas, capture them and offer a trade against what's committed. Keep replies short and action-first.”"),
  ("h2","3. Delegation to sub-agents"),
  ("p","Treat each project like it has its own manager. Your chief of staff sets each manager's tasks; the managers do the work. Even solo, this keeps work organized by area."),
  ("h2","4. A daily cadence"),
  ("check",["Morning: review goals + carryover, set today's 1-3 moves","Midday: quick re-check","Evening: what shipped, what slipped, what carries over"]),
  ("h1","Your afternoon build checklist"),
  ("check",["Create your context document","Paste the role-contract prompt","Name your projects + managers","Run your first morning brief","Log one decision and one win"]),
  ("callout","Remember","The goal isn't a smarter chatbot. It's never having to guess what to work on again."),
 ]})

P.append({"file":"02_context-nucleus.pdf","kicker":"The Solo Founder Series","footer":"The Context Nucleus",
 "title":"The Context Nucleus","subtitle":"One living document that becomes your second brain — so every AI tool you touch already knows your whole world.",
 "blocks":[
  ("h1","The problem with AI memory"),
  ("p","Every new chat starts from zero. You re-explain your business, your goals, your decisions — again. The Nucleus fixes this: one file every tool reads first."),
  ("h1","The structure"),
  ("h2","North Star"),
  ("p","The one outcome that matters. Changes rarely. It's the filter for everything."),
  ("h2","Active threads"),
  ("p","The 1-5 things in flight right now. A fresh session reads this and is instantly caught up."),
  ("h2","Decisions & conventions"),
  ("p","Choices already made, so nothing gets re-litigated. 'We use X, not Y.' 'Always do Z.'"),
  ("h2","Handoffs (the log)"),
  ("p","Newest-first, timestamped notes of what just happened. The message-in-a-bottle between sessions."),
  ("callout","The rule","Capture the signal, not the chatter. One crisp line per item. Dedupe. Keep it dense and high-signal."),
  ("h1","How to run it"),
  ("check",["Open every session: have your AI read the Nucleus","Capture decisions, preferences, and wins as they happen","Close every session: log what changed","Weekly: prune duplicates, promote patterns into the top sections"]),
  ("callout","Why it works","Context compounds. By week two your AI briefs you before you ask."),
 ]})

P.append({"file":"03_portfolio-like-a-company.pdf","kicker":"The Solo Founder Series","footer":"Portfolio Like a Company",
 "title":"Run a Portfolio Like a Company","subtitle":"The org chart, costs, and delegation model that lets one person operate like a team.",
 "blocks":[
  ("h1","From scattered projects to a company"),
  ("p","Multiple ventures become chaos when they live in your head. Give each one a structure and suddenly you're a CEO, not a juggler."),
  ("h1","The org chart"),
  ("p","Each venture gets a CEO 'agent' that delegates to sub-roles: marketing, research, product. You orchestrate the CEOs; they run their lanes."),
  ("check",["List every venture + its status","Give each a one-line 'goal right now'","Assign each a CEO + sub-roles","Set priority order — where focus goes first"]),
  ("h1","The cost map"),
  ("p","For each workstream, write: who runs it, what tool, monthly cost, status. You can't optimize what you can't see."),
  ("callout","The audit habit","Once a month: which tools serve an active workstream? Cut the rest. One tool per job."),
  ("h1","The cadence"),
  ("p","A daily brief sets each venture's top 1-3 tasks. A weekly review checks numbers + spend. The rhythm runs the company."),
  ("callout","Remember","Structure is leverage. The org chart is what lets one person hold five ventures without dropping any."),
 ]})

P.append({"file":"04_adhd-standup-planner.pdf","kicker":"Daily Systems","footer":"ADHD Standup Planner",
 "title":"The ADHD Daily Standup Planner","subtitle":"One screen, one next action. Plan your day the way an ADHD brain actually works.",
 "blocks":[
  ("h1","Why most planners fail you"),
  ("p","A wall of tasks is a wall of decisions — and decisions are where ADHD stalls. This planner gives you a decision already made: today's 1-3 that matter, and the single first action."),
  ("h1","Morning brief"),
  ("check",["What's my North Star this week?","What carried over from yesterday?","Today's 3 that matter (no more)","The ONE first action to take right now"]),
  ("h1","Midday check (optional)"),
  ("check",["Did I start the first action?","What's blocking me — and what's the smallest unblock?"]),
  ("h1","Evening close"),
  ("check",["What shipped today?","What slipped — and why?","What carries to tomorrow?","One win to name"]),
  ("callout","The rule","Drafted is not done. Shipped, sent, published — that's done. Momentum over perfection."),
  ("p","Print one per day, or keep it in a note. The format is the system."),
 ]})

P.append({"file":"05_delegate-to-ai-agents.pdf","kicker":"The Solo Founder Series","footer":"Delegate to AI Agents",
 "title":"Delegate to AI Agents","subtitle":"Stop doing every task yourself. Assign work to AI 'managers' and review the output.",
 "blocks":[
  ("h1","The mindset shift"),
  ("p","You are not the worker. You are the one who guides and approves. The AI does the work; you make the calls."),
  ("h1","Set up your managers"),
  ("p","Name an agent per area: a marketing manager, a research manager, a product manager. Give each a clear remit and a way to receive tasks."),
  ("check",["Define each manager's job in one sentence","Write the standing rules each follows","Create a simple task board: who's doing what","Review output — approve, redirect, or ship"]),
  ("h1","The hand-off pattern"),
  ("callout","Template","“As my [marketing] manager: [task]. Constraints: [brand/voice]. Deliver: [format]. I'll approve before it ships.”"),
  ("h1","What stays human"),
  ("p","Final approval, taste, relationships, and the decisions only you can make. Everything upstream of that can be delegated."),
 ]})

P.append({"file":"06_content-engine.pdf","kicker":"Content & Posting","footer":"1-Video-a-Week Engine",
 "title":"The 1-Video-a-Week Content Engine","subtitle":"Create once. Post all week. The batch-and-repurpose system that ends the daily blank page.",
 "blocks":[
  ("h1","The core idea"),
  ("p","You don't need to create every day — you need to create ONCE and atomize. One pillar (a video, a voice note, a rant) becomes a week of content across formats."),
  ("h1","Step 1 — Batch (the only part that needs you)"),
  ("check",["Block one 2-hour session per week","Record ONE pillar in your own voice","Don't edit or format during the session — just create"]),
  ("h1","Step 2 — Atomize"),
  ("p","Turn the one pillar into: short clips, a carousel, 2-3 written posts, quote cards, a meme, and a newsletter. Same idea, many shapes."),
  ("h1","Step 3 — Distribute"),
  ("check",["Queue each piece to its platform","Lead on your most responsive channel","Space them across the week","Published = done"]),
  ("callout","The flywheel","One hour of creation feeds a week of presence. The system, not your willpower, keeps you consistent."),
 ]})

P.append({"file":"07_beat-the-posting-block.pdf","kicker":"Content & Posting","footer":"Beat the Posting Block",
 "title":"Beat the Posting Block","subtitle":"You can make the content. You freeze on publish. Here's the system that gets it live anyway.",
 "blocks":[
  ("h1","The block is insecurity, not ability"),
  ("p","You can create all day. Hitting 'post' is where it stops — because posting feels like exposure. Name that, and you can engineer around it."),
  ("h1","Pre-decide everything"),
  ("p","Never face a blank decision at publish time. Decide what + where in advance, so all that's left is one physical action."),
  ("check",["Pick the platform before you create","Write the caption in advance","Shrink it to one action: 'paste this, hit publish'"]),
  ("h1","Shrink the action"),
  ("callout","The trick","The win isn't the recording — it's the posting. Separate them. Create now, post in a tiny scheduled moment with someone (or something) waiting with you."),
  ("h1","Redefine done"),
  ("p","Drafted is not done. A post that never goes live did nothing. Treat published as the only finish line, and celebrate it."),
  ("check",["Drafted ≠ done","Published = done","Name the win out loud when it's live"]),
 ]})

P.append({"file":"08_atomize.pdf","kicker":"Content & Posting","footer":"Atomize",
 "title":"Atomize One Idea Into a Week of Content","subtitle":"The repurposing template that turns a single pillar into a full week across every format.",
 "blocks":[
  ("h1","One pillar, many shapes"),
  ("p","A pillar is one raw idea: a video, transcript, or voice note. Atomizing means reshaping that single idea into every format your platforms reward."),
  ("h1","The week, mapped"),
  ("check",["Mon: anchor video / hook","Tue: carousel (the how)","Wed: written post (the argument)","Thu: quote cards","Fri: meme / relatable","Sat: use-case list","Sun: newsletter"]),
  ("h1","The rule of voice"),
  ("p","Every piece stays in your voice and ladders to one message. Don't dilute — repeat the core idea in new clothes."),
  ("callout","Pro move","Each piece ends with the same call to action. Repetition across formats is what makes the message stick."),
  ("h1","Fill-in template"),
  ("p","Core idea: ____. One-line hook: ____. The proof: ____. The CTA: ____. Now stamp it across all seven formats above."),
 ]})

P.append({"file":"09_cross-post.pdf","kicker":"Content & Posting","footer":"Cross-Post Everywhere",
 "title":"Cross-Post One Video Everywhere","subtitle":"The exact workflow to take one clip live on Facebook, Instagram, LinkedIn, X, and TikTok — fast.",
 "blocks":[
  ("h1","The setup"),
  ("p","One video, five platforms, minimal friction. The trick is a shared file source + per-platform captions ready in advance."),
  ("h1","Host the file once"),
  ("check",["Upload your video to cloud storage","Set sharing to 'anyone with the link'","Grab the direct file link"]),
  ("h1","Caption per platform"),
  ("p","Each platform wants a different shape: punchy + hashtags for IG/TikTok, value-framed for LinkedIn, short for X, warm + conversational for Facebook."),
  ("callout","Reach note","Native uploads usually beat third-party for short video — especially on TikTok. When reach matters, post natively."),
  ("h1","The platform reality"),
  ("check",["Facebook personal profiles: manual only (no tool can post them)","Pages, IG Business, LinkedIn, TikTok: schedulable","Lead on your most responsive platform first"]),
 ]})

P.append({"file":"10_caption-swipe-file.pdf","kicker":"Content & Posting","footer":"Caption Swipe File",
 "title":"The Caption Swipe File","subtitle":"Plug-and-play caption templates that stop the scroll — one for every platform.",
 "blocks":[
  ("h1","Why captions decide everything"),
  ("p","The first line is the whole game. These templates open with a hook, deliver value, and end with a question that drives replies."),
  ("h1","The universal skeleton"),
  ("check",["Line 1: a hook (tension, surprise, or a bold claim)","Middle: the value or story, short lines","Last line: a question that invites a reply"]),
  ("h1","Hooks that work"),
  ("ul",["'Most [people] do X. Here's what I do instead.'","'You don't need X. You need Y.'","'The honest reason I [did the thing].'","'[Surprising number] + the one thing nobody mentions.'"]),
  ("h1","Per-platform tone"),
  ("ul",["Facebook: warm, conversational, personal","Instagram/TikTok: punchy, emoji, hashtags","LinkedIn: value-framed, credible","X: short, sharp, one idea"]),
  ("callout","The CTA rule","Always end with the SAME ask across platforms. Comments are warm leads."),
 ]})

P.append({"file":"11_honest-newsletter.pdf","kicker":"Content & Posting","footer":"Honest Founder Newsletter",
 "title":"The Honest Founder Newsletter","subtitle":"A swipe file + structure for emails people actually open — because they sound like a human, not a brand.",
 "blocks":[
  ("h1","Why honesty outperforms polish"),
  ("p","People are numb to marketing and starved for real. The honest founder voice — plain, specific, a little vulnerable — is your unfair advantage."),
  ("h1","The structure"),
  ("check",["Hook: one honest line, no preamble","The turn: the real reason / lesson","The proof: a concrete example","The ask: reply with one thing"]),
  ("callout","Swipe","“Everyone's doing X right now. Most are selling magic. I won't. Here's the honest version...”"),
  ("h1","The reply engine"),
  ("p","End every email with a question that invites a one-line reply. Replies train deliverability AND surface warm leads."),
  ("h1","Cadence"),
  ("p","One real email a week beats five polished ones a month. Show up plainly and consistently."),
 ]})

P.append({"file":"12_brand-in-a-day.pdf","kicker":"Brand in a Day","footer":"Brand Yourself in a Day",
 "title":"Brand Yourself in a Day","subtitle":"Pick a mark, a palette, and a voice that make you instantly recognizable — in an afternoon.",
 "blocks":[
  ("h1","Recognizable beats fancy"),
  ("p","A brand isn't a logo — it's repetition. One mark, one palette, one voice, used everywhere, until people know it's you at a glance."),
  ("h1","The signature mark"),
  ("p","Find one visual element that's truly yours (a shape, an object you wear, a motif) and put it on everything."),
  ("check",["Pick ONE signature mark","Use it on every post, card, and cover","Keep it simple enough to draw from memory"]),
  ("h1","The palette"),
  ("p","Three colors max: a dark, a light, and one accent. Use them consistently and your feed becomes a cohesive wall."),
  ("h1","The voice"),
  ("check",["Write 5 phrases you'd actually say","Pick your tone: warm? sharp? plain?","Decide your 'always' and 'never'"]),
  ("callout","The test","If someone saw your post with no name on it, would they know it's you? That's a brand."),
 ]})

P.append({"file":"13_quote-card-pack.pdf","kicker":"Brand in a Day","footer":"Quote Card Pack",
 "title":"The Quote Card Playbook","subtitle":"How to make scroll-stopping branded quote cards — the format, the layout, the words that travel.",
 "blocks":[
  ("h1","Why quote cards work"),
  ("p","They're the most shareable format on social: one idea, big type, your brand mark. Cheap to make, high to spread."),
  ("h1","The layout formula"),
  ("check",["Square (1080x1080), brand background","One short, punchy line — big serif type","Your signature mark + handle at the bottom","High contrast: light text on dark, or reverse"]),
  ("h1","Words that travel"),
  ("ul",["Reframes: 'It's not X. It's Y.'","Permission: 'You don't have to X.'","Hard truths said simply","Numbers + a twist"]),
  ("callout","Consistency","Same template every time = a recognizable series. Vary the words, never the frame."),
  ("h1","The batch trick"),
  ("p","Write ten lines in one sitting, drop them into the same template, and you have two weeks of posts in an hour."),
 ]})

P.append({"file":"14_position-the-ai-person.pdf","kicker":"Brand in a Day","footer":"The AI Person",
 "title":"Position Yourself as ‘The AI Person’","subtitle":"Become the obvious choice in your circle for AI — without being the loudest or the most technical.",
 "blocks":[
  ("h1","The 1000-hours advantage"),
  ("p","You don't need to be the world expert. You need to have done the hours your audience hasn't. That gap IS your value."),
  ("callout","The pitch","“You don't need to learn AI. You need the 1000 hours someone already did.”"),
  ("h1","Position on time, not tech"),
  ("p","Nobody buys 'AI.' They buy their time back. Frame everything as: I find where your time leaks and build the thing that plugs it."),
  ("h1","Show, don't claim"),
  ("check",["Post the boring wins (a task now automated)","Share the honest reality, not hype","Name one task you'd automate for your audience","Invite the reply: 'what eats your week?'"]),
  ("h1","The anti-hype edge"),
  ("p","Everyone else sells magic. You sell honesty: AI isn't magic, it's a tool that does real work. That's the trust play that converts."),
 ]})

P.append({"file":"15_audit-your-subscriptions.pdf","kicker":"Money & Tools","footer":"Audit Your Subscriptions",
 "title":"Audit Your AI Subscriptions","subtitle":"The keep / cut / right-size worksheet that recovers hundreds a month from tools you forgot you pay for.",
 "blocks":[
  ("h1","The hidden leak"),
  ("p","Subscriptions accumulate silently. Most people pay for tools they don't use — and skip the ones that earn. This audit fixes both."),
  ("h1","Step 1 — Find them all"),
  ("check",["Search your email for 'receipt' and 'your subscription'","Check your purchases/payments category","List every recurring charge + amount"]),
  ("h1","Step 2 — Judge each one"),
  ("p","For each tool ask: does it serve an ACTIVE workstream right now? If not, it's a cut."),
  ("ul",["KEEP — tied to active revenue or content","CUT — inactive workstream, or you can rebuild it","RIGHT-SIZE — needed, but on the wrong (too-high) tier","DON'T START — the shiny tool you don't actually need"]),
  ("callout","Rule of thumb","One tool per job. Lean into free/native first. Your most-used tool is rarely the waste — the forgotten one is."),
  ("h1","Step 3 — Cancel cleanly"),
  ("p","Email a clear cancellation + refund request. If they stall, dispute the charge with your card. You're never held hostage."),
 ]})

P.append({"file":"16_cancel-anything.pdf","kicker":"Money & Tools","footer":"Cancel Anything",
 "title":"Cancel Anything","subtitle":"Copy-paste email templates that cancel stubborn subscriptions and get your money back.",
 "blocks":[
  ("h1","When 'cancel' is hidden on purpose"),
  ("p","Some services bury the cancel button. A firm, on-record email — with a deadline and a consequence — cuts through it."),
  ("h1","Template: standard cancellation"),
  ("callout","Copy-paste","“I'm requesting immediate cancellation of my [service] subscription, with no further charges, and confirmation in writing. Please confirm within 5 business days.”"),
  ("h1","Template: refund + can't-cancel"),
  ("callout","Copy-paste","“I've tried to cancel multiple times and couldn't. Please cancel immediately, refund my most recent charge, and confirm in writing within 5 business days, or I will dispute the charge with my card issuer as an unauthorized recurring charge.”"),
  ("h1","The escalation ladder"),
  ("check",["Day 1: send the cancellation email","No reply: resend daily","Still nothing: dispute via your bank/card","Keep every email — it's your evidence"]),
  ("callout","Why it works","A written deadline + a stated consequence + a paper trail. Vendors fold fast when a chargeback is on the table."),
 ]})

P.append({"file":"17_lean-ai-stack.pdf","kicker":"Money & Tools","footer":"Lean AI Tool Stack",
 "title":"The Lean AI Tool Stack","subtitle":"What to actually pay for in 2026 — and the expensive tools you can skip.",
 "blocks":[
  ("h1","Spend where it compounds"),
  ("p","Your AI dollars should go to the tools you touch every day — not the shiny ones you used once. Here's how to decide."),
  ("h1","Pay for"),
  ("ul",["One strong general model (your daily driver)","A scheduler for distribution","One voice/clip tool if you publish video","Cheap hosting + domains"]),
  ("h1","Think twice"),
  ("ul",["Multiple overlapping video generators — pick one","Avatar tools if you film yourself","All-in-one platforms you don't fully use","'Autonomous agent' tools that duplicate your main model"]),
  ("callout","The self-shot rule","If your brand is real, on-camera you, you need far fewer paid media tools than a faceless creator. Authenticity is cheaper AND converts better."),
  ("h1","Right-size, don't just cut"),
  ("p","Some tools you need only during production sprints. Subscribe the month you use them, pause the months you don't."),
 ]})

P.append({"file":"18_50-tasks-to-automate.pdf","kicker":"Practical AI","footer":"50 Tasks to Automate",
 "title":"50 Tasks to Automate in Your Business","subtitle":"A checklist of the real, boring, time-eating tasks AI can take off your plate today.",
 "blocks":[
  ("h1","Start where the time leaks"),
  ("p","Don't automate for fun — automate the task stealing the most hours. Scan this list and tick the ones that hurt."),
  ("h1","Customer & sales"),
  ("check",["Answer missed calls / inbound","Book appointments","Reply to FAQs","Follow up with leads","Draft proposals"]),
  ("h1","Content & marketing"),
  ("check",["Repurpose one video into a week of posts","Write captions + newsletters","Generate quote cards","Schedule cross-posts"]),
  ("h1","Operations"),
  ("check",["Track inventory","Summarize meetings","One dashboard instead of nine tabs","Sort + label your inbox","Generate invoices"]),
  ("callout","The pick","Circle the ONE that costs you the most hours. That's where you start — not all fifty at once."),
 ]})

P.append({"file":"19_first-company-gpt.pdf","kicker":"Practical AI","footer":"Your First Company GPT",
 "title":"Your First Company GPT","subtitle":"Set up an AI assistant that actually knows your business — your offers, your voice, your FAQs.",
 "blocks":[
  ("h1","A generic AI gives generic answers"),
  ("p","Feed it your business and it becomes yours: it pitches in your voice, answers in your facts, and never goes off-brand."),
  ("h1","What to feed it"),
  ("check",["Your offers + pricing","Your brand voice (5 example phrases)","Your top 20 FAQs + answers","Your ideal customer + their pain","What you do NOT do"]),
  ("h1","Give it a job"),
  ("callout","Instruction","“You represent [business]. Answer only from the facts above, in our voice. If you don't know, say so and offer to connect them to a human.”"),
  ("h1","Put it to work"),
  ("ul",["Draft customer replies","Qualify leads","Onboard new clients","Brief you on your own business"]),
  ("h1","Keep it fresh"),
  ("p","Update it whenever an offer, price, or FAQ changes. A company GPT is only as good as its last update."),
 ]})

P.append({"file":"20_complete-bundle.pdf","kicker":"The Complete System","footer":"The Solo Founder's AI OS",
 "title":"The Solo Founder's AI Operating System","subtitle":"The complete bundle: every system to run your whole business with AI — context, content, brand, money, and automation.",
 "blocks":[
  ("h1","Everything, in one operating system"),
  ("p","This is the full stack — the same system used to run a multi-venture portfolio solo. Each part stands alone; together they're a company in a box."),
  ("h1","What's inside"),
  ("ul",["The AI Chief of Staff + Context Nucleus (your brain)","Portfolio org chart + agent delegation (your structure)","The 1-Video content engine + posting systems (your reach)","Brand-in-a-day + quote cards (your identity)","Subscription audit + cancel templates (your money)","50 tasks to automate + your first company GPT (your leverage)"]),
  ("h1","How to use the bundle"),
  ("check",["Week 1: stand up context + chief of staff","Week 2: launch the content engine","Week 3: lock your brand","Week 4: audit spend + automate one task"]),
  ("callout","The promise","One person, operating like a team — because the systems carry the load you used to carry alone."),
 ]})

for s in P:
    build(s)
print("TOTAL:", len(P))
