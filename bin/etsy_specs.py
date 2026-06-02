import sys; sys.path.insert(0, "bin")
from etsybuild import build

P = []
def add(**k): P.append(k)

ROLE = ("You are my chief of staff and execution partner. Standing rules: "
"(1) DRIVE - at the start of each session propose my top 1-3 tasks toward [MY GOAL]; don't wait to be asked. "
"(2) PROTECT COMMITMENTS - when I bring a new idea, capture it and offer a trade against what's already committed; never just say yes. "
"(3) REDUCE DECISIONS, not effort - give me ONE clear next move, not six options. "
"(4) Treat drafted-but-unshipped work as NOT done. (5) Keep replies short and action-first. "
"Confirm you understand, then ask me for my Context Doc.")

# 01
add(file="01_ai-chief-of-staff.pdf", kicker="The Solo Founder Series", footer="AI Chief of Staff",
 title="Build Your AI Chief of Staff",
 subtitle="Turn any AI assistant into a chief of staff that runs your day, protects your focus, and never forgets your context - with copy-paste prompts you run in one tap.",
 blocks=[
 ("onepager","Turn any AI into a chief of staff that runs your day - in 5 moves.",
  ["Create ONE Context Doc your AI reads first: goals, projects, decisions, a running log.",
   "Paste the Role Contract so it DRIVES - sets your day and protects your commitments.",
   "Give each project a manager. The AI delegates and drafts; you approve.",
   "Run a 60-second Morning Brief: today's 1-3 that matter + the single first action.",
   "Close each day in 60 seconds: what shipped, what slipped, one win. Repeat."]),
 ("h1","The deep walkthrough"),
 ("p","Five steps. Each has a copy-paste prompt - tap 'Run in ChatGPT' or 'Run in Claude' and it auto-fills. Do them in order once; after that it runs on rails."),
 ("step",1,"Build your Context Doc","Your AI's memory - one document it reads at the start of every session so you never re-explain yourself. Run the prompt, answer its questions, paste the result somewhere reusable."),
 ("prompt","generate your Context Doc","Help me build a Context Doc my AI will read at the start of every session. Interview me ONE question at a time to capture: (1) my North Star - the single outcome that matters most right now; (2) my active projects and each one's current goal; (3) decisions and preferences I've already made; (4) anything you should never do. When finished, output it as a clean, dated document I can paste into any chat."),
 ("step",2,"Install the Role Contract","This is what makes the AI a chief of staff instead of a chatbot. Paste it at the start of a session or save it as a custom instruction."),
 ("prompt","the Role Contract (paste at session start)", ROLE),
 ("step",3,"Set up your managers","Don't pile every task into one chat. Give each project its own manager with a clear remit. Run once per project."),
 ("prompt","spin up a project manager","Act as the manager for my project [PROJECT NAME]. Your remit in one sentence: [WHAT THIS PROJECT NEEDS]. My brand/voice: [DESCRIBE]. When I give you a task, deliver [FORMAT], then STOP for my approval before anything ships. Start by listing the 3 things you'd work on first and why."),
 ("step",4,"Run the Morning Brief","Open your day with this. One-screen plan, not a wall of tasks. Lead with the single first action."),
 ("prompt","your 60-second Morning Brief","It's the start of my day. Read my Context Doc. Give me a 60-second morning brief: (1) what carried over from yesterday; (2) today's 1-3 tasks that most move [MY GOAL]; (3) the SINGLE first action to take right now. One screen. Lead with the action."),
 ("step",5,"Run the Evening Close","Close the loop so tomorrow starts warm. Captures what happened into your Context Doc's log."),
 ("prompt","your 60-second Evening Close","It's the end of my day. Ask me: what shipped, what slipped (and why), what carries to tomorrow, and one win. Then write a one-line, dated handoff into my Context Doc's log, and tell me tomorrow's likely first move."),
 ("h1","Bonus prompt pack"),
 ("prompt","unstick me (for avoidance)","I'm avoiding [TASK]. Don't motivate me - shrink it. Give me the smallest possible first physical action (under 2 minutes) that starts it, then wait while I do it."),
 ("prompt","weekly review","Run my weekly review. From my Context Doc and what I tell you: what moved toward [MY GOAL], what stalled, what to cut, and my 3 priorities for next week. End with one honest observation about where I'm avoiding."),
 ("callout","The payoff","Run this for one week. Open every session with the Role Contract + Context Doc; close with the Evening Close. By day seven your AI briefs you before you ask. That's a chief of staff - built in an afternoon."),
 ])

# 02
add(file="02_context-nucleus.pdf", kicker="The Solo Founder Series", footer="The Context Nucleus",
 title="The Context Nucleus",
 subtitle="One living document that becomes your second brain - so every AI tool you touch already knows your whole world. Prompts included.",
 blocks=[
 ("onepager","One document. Every AI tool reads it first. You never re-explain yourself.",
  ["Create the Nucleus with four sections: North Star, Active Threads, Decisions, Log.",
   "Paste the 'read this first' prompt at the start of any chat.",
   "Capture decisions and wins as one-line entries the moment they happen.",
   "Close each session by logging what changed (newest first).",
   "Weekly: prune duplicates, lift repeated patterns into the top sections."]),
 ("h1","The deep walkthrough"),
 ("step",1,"Generate your Nucleus","Run this once. It builds the four-section document for you from a short interview."),
 ("prompt","build the Nucleus","Build me a 'Context Nucleus' - a single living document that any AI tool can read to understand my whole world. Use four sections: NORTH STAR (the one outcome that matters), ACTIVE THREADS (the 1-5 things in flight), DECISIONS & CONVENTIONS (choices already made), and LOG (dated, newest-first notes). Interview me briefly, then output it clean and dated."),
 ("step",2,"Load it into any tool","Start of any chat, paste this so the AI uses your context instead of guessing."),
 ("prompt","read-this-first","Here is my Context Nucleus. Read it fully before doing anything. Use it as the source of truth for my goals, decisions, and current work. If something I ask conflicts with it, flag the conflict. Confirm you've read it in one line, then ask what I want to do.\n\n[PASTE YOUR NUCLEUS HERE]"),
 ("step",3,"Capture as you go","Don't try to remember - capture. One crisp line per item, deduped."),
 ("prompt","capture this","Add this to my Nucleus in the right section (decision, preference, fact, milestone, or open loop): [THE THING]. Keep it to one crisp line, dated. If it duplicates something already there, update that line instead of adding a new one."),
 ("step",4,"Self-improve weekly","Keep it dense. Promote recurring patterns into durable rules."),
 ("prompt","tidy my Nucleus","Review my Nucleus with fresh eyes. Collapse duplicates, drop stale open loops, and lift any pattern that appears several times in the log up into Decisions as a durable rule. Return the tightened version + a 2-line summary of what you changed."),
 ("callout","Why it works","Context compounds. By week two your AI stops asking who you are and starts briefing you on what's next."),
 ])

# 03
add(file="03_portfolio-like-a-company.pdf", kicker="The Solo Founder Series", footer="Portfolio Like a Company",
 title="Run a Portfolio Like a Company",
 subtitle="The org chart, cost map, and delegation cadence that let one person operate like a team. With prompts to run it.",
 blocks=[
 ("onepager","Turn scattered projects into a company you run like a CEO.",
  ["List every venture + a one-line 'goal right now' for each.",
   "Give each venture a CEO role and sub-roles (marketing, research, product).",
   "Build a cost map: who/what runs each workstream and what it costs.",
   "Set priority order - where focus goes first.",
   "Run a weekly review across all ventures: numbers, spend, next moves."]),
 ("h1","The deep walkthrough"),
 ("step",1,"Map the portfolio","Get every venture out of your head and onto one page."),
 ("prompt","map my portfolio","Help me map my venture portfolio. For each venture I name, capture: status, the ONE goal right now, and who/what runs it. Then propose a priority order (where my focus should go first) and tell me which venture is most neglected relative to its potential."),
 ("step",2,"Assign the org chart","Each venture gets a CEO and sub-roles so work is organized by area."),
 ("prompt","build the org chart","For my venture [NAME], design a simple AI-run org chart: a CEO role (sets weekly priorities) and sub-roles for marketing, research, and product. Write a one-sentence remit for each role and the first task each should own."),
 ("step",3,"Build the cost map","You can't optimize what you can't see."),
 ("prompt","cost map + audit","Here are my tools and rough monthly costs: [LIST]. For each, tell me which active workstream it serves, then label it KEEP, CUT, RIGHT-SIZE, or DON'T-START with a one-line reason. End with my total recoverable spend."),
 ("step",4,"Run the weekly review","The cadence is what makes it a company, not a pile."),
 ("prompt","portfolio weekly review","Run my portfolio weekly review. For each venture: what moved, what stalled, and the top 1-3 tasks for next week. Flag the single most important thing across the whole portfolio, and one thing I should stop doing."),
 ("callout","Remember","Structure is leverage. The org chart is what lets one person hold five ventures without dropping any."),
 ])

# 04
add(file="04_adhd-standup-planner.pdf", kicker="Daily Systems", footer="ADHD Standup Planner",
 title="The ADHD Daily Standup Planner",
 subtitle="One screen, one next action. Plan your day the way an ADHD brain actually works - with AI prompts that set it for you.",
 blocks=[
 ("onepager","Stop facing a wall of tasks. Face one next action.",
  ["Morning: name today's 1-3 that matter - no more.",
   "Pick the SINGLE first action and start there.",
   "Midday: did you start it? What's the smallest unblock?",
   "Evening: what shipped, what slipped, one win.",
   "Drafted is not done. Shipped/published is done."]),
 ("h1","The deep walkthrough"),
 ("step",1,"Set the day in 60 seconds","Don't plan everything - decide the 1-3 that matter and the first move."),
 ("prompt","set my day","Be my ADHD chief of staff. Ask me what's on my plate today, then cut it to the 1-3 tasks that matter most toward [MY GOAL]. Give me ONE first action to take right now - the smallest physical step. Don't give me a long list."),
 ("step",2,"Beat the freeze","When you stall, shrink the task until it's impossible to avoid."),
 ("prompt","shrink the task","I'm frozen on [TASK]. Break it into the smallest possible first step (under 2 minutes), then the next, then the next - but only show me ONE at a time. Wait for me to say 'done' before the next."),
 ("step",3,"Midday reset","A quick check keeps the day from slipping away."),
 ("prompt","midday reset","It's midday. Ask me what I've actually done, then re-set my single most important next action for the rest of the day. Keep it to two lines."),
 ("step",4,"Close the day","Name the win. Momentum is built on noticing it."),
 ("prompt","close my day","Close out my day: ask what shipped, what slipped (no shame, just why), and one win. Then tell me the likely first action for tomorrow so I start warm."),
 ("callout","The rule","Reduce decisions, not effort. One clear next move at a time. Momentum over perfection."),
 ])

# 05
add(file="05_delegate-to-ai-agents.pdf", kicker="The Solo Founder Series", footer="Delegate to AI Agents",
 title="Delegate to AI Agents",
 subtitle="Stop doing every task yourself. Assign work to AI managers, review the output, and keep only the decisions that need you.",
 blocks=[
 ("onepager","You're not the worker. You're the one who guides and approves.",
  ["Name a manager per area: marketing, research, product, ops.",
   "Give each a one-sentence remit and standing rules.",
   "Hand off with a clear task + the deliverable format.",
   "Review: approve, redirect, or ship. Nothing ships without you.",
   "Keep the human-only work: taste, relationships, final calls."]),
 ("h1","The deep walkthrough"),
 ("step",1,"Define a manager","One sentence of remit beats a paragraph of vague instructions."),
 ("prompt","define a manager","Act as my [marketing] manager. Write your own job description in one sentence, list the standing rules you'll follow, and propose the first 3 things you'd work on for [MY BUSINESS]. Then wait for my go."),
 ("step",2,"Hand off a task","Make the deliverable and the stop-point explicit."),
 ("prompt","hand off a task","Task for you as my [role] manager: [TASK]. Constraints: [BRAND/VOICE/LIMITS]. Deliver it as [FORMAT]. Do not ship or send anything - present it to me for approval first. If anything's ambiguous, ask before starting."),
 ("step",3,"Review fast","A quick rubric keeps quality high without you redoing the work."),
 ("prompt","review this draft","Critique your own draft as if you were a tough editor: what's weak, what's off-brand, what to cut. Then give me the improved version. Be honest, not flattering."),
 ("callout","What stays human","Final approval, taste, relationships, and the calls only you can make. Everything upstream of that can be delegated."),
 ])

# 06
add(file="06_content-engine.pdf", kicker="Content & Posting", footer="1-Video-a-Week Engine",
 title="The 1-Video-a-Week Content Engine",
 subtitle="Create once, post all week. The batch-and-repurpose system that ends the daily blank page - with prompts that do the atomizing.",
 blocks=[
 ("onepager","One hour of creation feeds a week of presence.",
  ["Batch: record ONE pillar a week in your own voice.",
   "Atomize it into clips, a carousel, posts, quote cards, a meme, a newsletter.",
   "Keep every piece in your voice, laddering to one message.",
   "Queue across the week; lead on your most responsive platform.",
   "Published = done. The system carries consistency, not your willpower."]),
 ("h1","The deep walkthrough"),
 ("step",1,"Pick the pillar","One raw idea is enough. Don't polish - capture."),
 ("prompt","find my pillar","Ask me 3 questions about what I know or care about this week, then propose 3 'pillar' ideas - each a single strong message worth a week of content. Pick the one with the clearest hook and tell me why."),
 ("step",2,"Atomize the pillar","Turn one idea into a full week, every format."),
 ("prompt","atomize into a week","Here's my pillar: [PASTE TRANSCRIPT OR IDEA]. Atomize it into a week of content, all in my voice and laddering to one message: a 60-sec video hook, a 6-slide carousel, 2 written posts, 3 quote-card lines, 1 meme concept, and a short newsletter. Keep each tight."),
 ("step",3,"Write the captions","Hook first, reply-driving question last."),
 ("prompt","captions per platform","Write platform captions for this piece: [PASTE]. Facebook (warm), Instagram/TikTok (punchy + 5 hashtags), LinkedIn (value-framed), X (short). Each opens with a hook and ends with the SAME question to drive replies."),
 ("callout","The flywheel","Batch once. Atomize with the prompts. Queue it. One pillar = a week you didn't have to think about."),
 ])

# 07
add(file="07_beat-the-posting-block.pdf", kicker="Content & Posting", footer="Beat the Posting Block",
 title="Beat the Posting Block",
 subtitle="You can make the content. You freeze on publish. Here's the system - and the prompts - that get it live anyway.",
 blocks=[
 ("onepager","The block is insecurity, not ability. Engineer around it.",
  ["Pre-decide what + where before you create - no blank decision at publish.",
   "Write the caption in advance so only one action is left.",
   "Shrink it to: 'paste this, hit publish.'",
   "Separate creating from posting - post in a tiny scheduled moment.",
   "Drafted is not done. Published is done. Name the win out loud."]),
 ("h1","The deep walkthrough"),
 ("step",1,"Name the avoidance","You can't fix what you won't name. This is fear, not laziness."),
 ("prompt","name what's stopping me","I keep making content but not posting it. Ask me 3 short questions to find what I'm actually afraid of when I hit publish, then reflect it back in one honest sentence and one reframe."),
 ("step",2,"Pre-decide everything","Remove every decision from publish-time."),
 ("prompt","pre-decide the post","For this content: [DESCRIBE], decide FOR me: which ONE platform, the exact caption, and the single posting action. Don't give me options - make the call so all I do is paste and publish."),
 ("step",3,"Shrink and ship","Make the action too small to avoid."),
 ("prompt","walk me through posting","Walk me through posting this RIGHT NOW, one tiny step at a time - open the app, paste, hit publish. One instruction per message. Wait for me to say 'done' before the next. Celebrate when it's live."),
 ("callout","Redefine done","A post that never goes live did nothing. Published is the only finish line - and it deserves a celebration every time."),
 ])

# 08
add(file="08_atomize.pdf", kicker="Content & Posting", footer="Atomize",
 title="Atomize One Idea Into a Week of Content",
 subtitle="The repurposing system that turns a single pillar into a full week across every format - prompts included.",
 blocks=[
 ("onepager","One pillar, many shapes. Repeat the message in new clothes.",
  ["Start with one raw pillar: a video, transcript, or voice note.",
   "Map it across the week: anchor, carousel, post, quote cards, meme, list, newsletter.",
   "Keep every piece in your voice and pointed at one message.",
   "End each piece with the same call to action.",
   "Repetition across formats is what makes it stick."]),
 ("h1","The deep walkthrough"),
 ("step",1,"Extract the core","Find the one message worth repeating all week."),
 ("prompt","find the core message","Here's my raw pillar: [PASTE]. Pull out the ONE core message worth a week of content, plus 3 supporting points and the single best hook line. Keep it tight."),
 ("step",2,"Map the week","Same idea, seven shapes."),
 ("prompt","map my week","Turn this core message into a 7-day content map (anchor video, carousel, written post, quote cards, meme, use-case list, newsletter). For each, give the hook and the angle - all in my voice, all pointing to the same CTA: [YOUR CTA]."),
 ("step",3,"Draft on demand","Generate any single piece, ready to post."),
 ("prompt","draft this piece","Write the [carousel] from my week map in full, ready to post: [PASTE THE MAP LINE]. Match my voice, open with the hook, close with my CTA."),
 ("callout","Pro move","Write the CTA once and stamp it on every format. Consistency is the multiplier."),
 ])

# 09
add(file="09_cross-post.pdf", kicker="Content & Posting", footer="Cross-Post Everywhere",
 title="Cross-Post One Video Everywhere",
 subtitle="The exact workflow to take one clip live on Facebook, Instagram, LinkedIn, X, and TikTok - fast.",
 blocks=[
 ("onepager","One clip, five platforms, minimal friction.",
  ["Host the file once in cloud storage; set it to 'anyone with the link'.",
   "Write a caption shaped for each platform in advance.",
   "Post natively where reach matters most (especially TikTok).",
   "Know the rules: personal Facebook profiles can't be auto-posted.",
   "Lead on your most responsive platform first."]),
 ("h1","The deep walkthrough"),
 ("step",1,"Prep the asset","One source file, ready to reuse everywhere."),
 ("prompt","prep my clip","I have a [length] video about [topic]. Give me a quick pre-post checklist: aspect ratio per platform, caption length limits, hashtag norms, and where native upload beats scheduling for reach."),
 ("step",2,"Caption for each platform","Different platform, different shape - same message."),
 ("prompt","five captions","Write captions for this video on Facebook, Instagram, TikTok, LinkedIn, and X: [DESCRIBE VIDEO]. Match each platform's tone, open with a hook, end with the same question. Keep IG/TikTok punchy with 5 hashtags; LinkedIn value-framed; X short."),
 ("step",3,"Sequence the posts","Order matters - start where your people respond."),
 ("prompt","posting order","Given my most responsive platforms are [LIST in order], tell me the order to post this clip and roughly when, to maximize engagement and cross-pollination. Keep it to a simple schedule."),
 ("callout","Reach note","Native uploads usually beat third-party for short video. When reach matters, post natively."),
 ])

# 10
add(file="10_caption-swipe-file.pdf", kicker="Content & Posting", footer="Caption Swipe File",
 title="The Caption Swipe File",
 subtitle="Plug-and-play caption templates and hooks that stop the scroll - one set for every platform, plus a prompt to generate more.",
 blocks=[
 ("onepager","The first line is the whole game.",
  ["Open with a hook: tension, surprise, or a bold claim.",
   "Keep the middle short - one idea, white space.",
   "End with a question that invites a one-line reply.",
   "Match tone to platform; keep the CTA the same everywhere.",
   "Comments are warm leads - the question is the engine."]),
 ("h1","The hook library"),
 ("ul",["'Most [people] do X. Here's what I do instead.'",
        "'You don't need X. You need Y.'",
        "'The honest reason I [did the thing].'",
        "'[Surprising number] - and the one thing nobody mentions.'",
        "'I almost didn't post this.'"]),
 ("h1","The deep walkthrough"),
 ("step",1,"Build the skeleton","Hook, value, question. Every time."),
 ("prompt","caption from skeleton","Write a caption about [TOPIC] using this skeleton: line 1 = a scroll-stopping hook; middle = the value in short lines; last line = a question that drives replies. Give me 3 versions with different hooks."),
 ("step",2,"Match the platform","Same idea, right shape."),
 ("prompt","reshape per platform","Take this caption: [PASTE]. Reshape it for Facebook (warm), Instagram/TikTok (punchy + hashtags), LinkedIn (credible), and X (short). Keep the hook and the closing question."),
 ("callout","The CTA rule","End with the SAME ask across platforms. Train your audience to reply - that's where leads come from."),
 ])

# 11
add(file="11_honest-newsletter.pdf", kicker="Content & Posting", footer="Honest Founder Newsletter",
 title="The Honest Founder Newsletter",
 subtitle="A structure, swipe lines, and prompts for emails people actually open - because they sound like a human, not a brand.",
 blocks=[
 ("onepager","Honesty outperforms polish. Be plain, specific, a little vulnerable.",
  ["Hook: one honest line, no preamble.",
   "The turn: the real reason or lesson.",
   "The proof: one concrete example.",
   "The ask: reply with one thing.",
   "One real email a week beats five polished ones a month."]),
 ("h1","The deep walkthrough"),
 ("step",1,"Find the honest angle","The story you'd hesitate to tell is usually the one that lands."),
 ("prompt","find my angle","Ask me what happened this week in my work or life that taught me something. Then turn it into the honest angle for a short newsletter - the real, slightly vulnerable version, not the polished one."),
 ("step",2,"Write it in your voice","Plain words. Short lines. No corporate gloss."),
 ("prompt","draft the email","Write a short, honest founder newsletter from this angle: [PASTE]. Structure: a one-line hook, the turn (real reason/lesson), one concrete proof, and an ask to reply with one thing. Plain voice, no hype, no jargon."),
 ("step",3,"Sharpen the subject","The subject decides if it's opened at all."),
 ("prompt","subject lines","Give me 7 subject lines for this email: [PASTE]. Honest and curiosity-driven, not clickbait. Mark the one you'd send and why."),
 ("callout","The reply engine","End every email asking for a one-line reply. Replies lift deliverability and surface your warmest leads."),
 ])

# 12
add(file="12_brand-in-a-day.pdf", kicker="Brand in a Day", footer="Brand Yourself in a Day",
 title="Brand Yourself in a Day",
 subtitle="Pick a mark, a palette, and a voice that make you instantly recognizable - in an afternoon, with prompts to decide each.",
 blocks=[
 ("onepager","A brand isn't a logo - it's repetition.",
  ["Pick ONE signature mark that's truly yours.",
   "Choose three colors: a dark, a light, one accent.",
   "Define your voice: 5 phrases, your tone, your always/never.",
   "Use all three on everything until people know it's you.",
   "The test: with no name on it, would they know it's yours?"]),
 ("h1","The deep walkthrough"),
 ("step",1,"Find your mark","One recognizable element beats a fancy logo."),
 ("prompt","find my signature mark","Ask me about my look, my story, and what people associate with me. Then propose 3 possible 'signature marks' (an object, shape, or motif) I could put on everything to become instantly recognizable. Recommend one and why."),
 ("step",2,"Lock the palette + voice","Constraints make a brand cohesive."),
 ("prompt","palette + voice","Help me lock a simple brand. Suggest a 3-color palette (dark, light, one accent) that fits [DESCRIBE VIBE], and interview me to capture my voice: 5 phrases I'd actually say, my tone, and 3 'always' and 3 'never' rules."),
 ("step",3,"Apply it","A quick checklist so it shows up everywhere."),
 ("prompt","brand checklist","Give me a one-page checklist to apply my brand (mark, palette, voice) consistently across my profile, posts, thumbnails, and PDFs - so everything looks like the same person made it."),
 ("callout","The test","If someone saw your post with no name on it, would they know it's you? That's a brand."),
 ])

# 13
add(file="13_quote-card-pack.pdf", kicker="Brand in a Day", footer="Quote Card Playbook",
 title="The Quote Card Playbook",
 subtitle="How to make scroll-stopping branded quote cards - the layout, the words that travel, and prompts to generate them in bulk.",
 blocks=[
 ("onepager","The most shareable format on social - cheap to make, high to spread.",
  ["Square, brand background, one short punchy line in big type.",
   "Your signature mark + handle at the bottom.",
   "High contrast: light on dark, or reverse.",
   "Write words that travel: reframes, permission, hard truths.",
   "Same template every time = a recognizable series."]),
 ("h1","The deep walkthrough"),
 ("step",1,"Generate the lines","Quote cards live or die on the words."),
 ("prompt","quote card lines","Give me 15 short, punchy quote-card lines about [TOPIC] in my voice. Mix reframes ('It's not X, it's Y'), permission ('You don't have to X'), and hard truths said simply. Each under 12 words."),
 ("step",2,"Pick the winners","Not every line travels - choose the sharp ones."),
 ("prompt","rank my lines","Here are my quote lines: [PASTE]. Rank the top 7 most shareable and tell me why each works. Flag any that are too long or too vague to land."),
 ("callout","The batch trick","Write ten lines in one sitting, drop them into the same template, and you've got two weeks of posts in an hour."),
 ])

# 14
add(file="14_position-the-ai-person.pdf", kicker="Brand in a Day", footer="The AI Person",
 title="Position Yourself as the AI Person",
 subtitle="Become the obvious choice in your circle for AI - without being the loudest or the most technical. With positioning prompts.",
 blocks=[
 ("onepager","You don't need to be the expert. You need the 1000 hours they haven't done.",
  ["Position on TIME, not tech - you buy back their hours.",
   "Show, don't claim: post the boring wins you actually built.",
   "Be the anti-hype voice: AI isn't magic, it's a tool that does real work.",
   "Invite the reply: 'what task eats your week?'",
   "Honesty is the trust play that converts."]),
 ("h1","The deep walkthrough"),
 ("step",1,"Write your positioning","One sentence anyone can repeat."),
 ("prompt","my positioning line","Help me write a one-line positioning statement that frames me as the go-to AI person for [MY AUDIENCE] - based on TIME saved, not tech. Give me 5 options, plain and anti-hype, and mark the strongest."),
 ("step",2,"Find your proof","Stories beat claims."),
 ("prompt","turn wins into proof","Ask me about tasks I've automated or built with AI. Turn each into a short, concrete 'show don't tell' post that proves I do this - boring-but-real, no hype."),
 ("step",3,"Make the offer","Invite the conversation that becomes a client."),
 ("prompt","the soft offer","Write 3 soft-offer posts that invite my audience to tell me the one task eating their week, framed as 'I'll tell you if it's worth automating.' Warm, low-pressure, anti-hype."),
 ("callout","The edge","Everyone else sells magic. You sell honesty: AI isn't magic, it's a tool that does real work. That's what converts."),
 ])

# 15
add(file="15_audit-your-subscriptions.pdf", kicker="Money & Tools", footer="Audit Your Subscriptions",
 title="Audit Your AI Subscriptions",
 subtitle="The keep / cut / right-size system that recovers hundreds a month from tools you forgot you pay for - with a prompt that does the analysis.",
 blocks=[
 ("onepager","Subscriptions leak silently. Find them, judge them, cut cleanly.",
  ["Find every recurring charge in your email and statements.",
   "For each, ask: does it serve an ACTIVE workstream right now?",
   "Label each: KEEP, CUT, RIGHT-SIZE, or DON'T-START.",
   "One tool per job. Lean into free/native first.",
   "Cancel with a firm email; dispute the charge if they stall."]),
 ("h1","The deep walkthrough"),
 ("step",1,"Find them all","You can't cut what you can't see."),
 ("prompt","find my subscriptions","Give me a search plan to find every recurring charge I'm paying: the exact email search terms (receipt, invoice, your subscription, renew), where to look in my bank/card statements, and a simple table to list each tool, amount, and renewal date."),
 ("step",2,"Run the audit","Judge each tool against active work."),
 ("prompt","audit my tools","Here are my tools + monthly costs + what each is for: [LIST]. Label each KEEP, CUT, RIGHT-SIZE, or DON'T-START with a one-line reason tied to whether it serves an active workstream. End with my total recoverable spend per month."),
 ("step",3,"Cancel cleanly","A firm, on-record request gets results."),
 ("prompt","cancellation email","Write a firm but polite cancellation + refund email for [SERVICE]: request immediate cancellation, no further charges, a refund of the last charge, and written confirmation in 5 business days - or I dispute the charge with my card issuer."),
 ("callout","Rule of thumb","Your most-used tool is rarely the waste. The forgotten one is. Hunt the forgotten charges."),
 ])

# 16
add(file="16_cancel-anything.pdf", kicker="Money & Tools", footer="Cancel Anything",
 title="Cancel Anything",
 subtitle="Copy-paste email templates and prompts that cancel stubborn subscriptions and get your money back.",
 blocks=[
 ("onepager","When 'cancel' is hidden on purpose, a firm email cuts through.",
  ["Send a clear cancellation with a deadline and a consequence.",
   "No reply? Resend daily.",
   "Still nothing? Dispute the charge with your card issuer.",
   "Keep every email - it's your evidence.",
   "A stated chargeback makes vendors fold fast."]),
 ("h1","Ready-to-send templates"),
 ("prompt","standard cancellation","Subject: Immediate cancellation request - [SERVICE]\n\nI'm requesting immediate cancellation of my [SERVICE] subscription tied to [EMAIL], with no further charges, and written confirmation within 5 business days. Please confirm in writing."),
 ("prompt","can't-cancel + refund","Subject: Cancellation + refund - [SERVICE]\n\nI've tried to cancel multiple times and couldn't. Please cancel immediately, refund my most recent charge, and confirm in writing within 5 business days - or I will dispute the charge with my card issuer as an unauthorized recurring charge."),
 ("h1","The escalation ladder"),
 ("step",1,"Send, then resend","Daily, politely, on the record."),
 ("prompt","write today's follow-up","Write a short, firmer follow-up to my cancellation email for [SERVICE] - it's been [N] days with no reply. Reference the original date, restate the 5-day deadline, and note I'll dispute the charge if unanswered."),
 ("step",2,"Dispute if needed","The card network is your leverage."),
 ("prompt","prep my dispute","Help me prepare a card dispute for [SERVICE]: summarize the timeline, the cancellation attempts, and why it's an unauthorized recurring charge, in a few clear sentences I can submit to my bank."),
 ("callout","Why it works","A written deadline + a stated consequence + a paper trail. Vendors fold fast when a chargeback is on the table."),
 ])

# 17
add(file="17_lean-ai-stack.pdf", kicker="Money & Tools", footer="Lean AI Tool Stack",
 title="The Lean AI Tool Stack",
 subtitle="What to actually pay for - and the expensive tools you can skip - with a prompt to right-size your own stack.",
 blocks=[
 ("onepager","Spend where it compounds. Skip the shiny tools you used once.",
  ["Pay for: one strong daily-driver model, a scheduler, one voice/clip tool, hosting.",
   "Think twice: overlapping video generators - pick one.",
   "Skip avatar tools if you film yourself.",
   "Cut 'autonomous agent' tools that duplicate your main model.",
   "Right-size: subscribe only the months you actually use a tool."]),
 ("h1","The deep walkthrough"),
 ("step",1,"Right-size your stack","Match spend to how you actually work."),
 ("prompt","right-size my stack","Here's my current AI/tool spend: [LIST with costs]. Tell me what to keep, what's redundant (overlapping jobs), what to right-size to a cheaper tier, and what to cancel. Factor in that my brand is [self-shot / faceless]. Give me the leanest stack that still does the job."),
 ("step",2,"Decide before you buy","Stop impulse subscriptions."),
 ("prompt","should I buy this","I'm tempted to subscribe to [TOOL] at [PRICE]. Ask me what active workstream it would serve and whether I already own a tool that does the job. Then give me a straight keep/skip with one reason."),
 ("callout","The self-shot rule","If your brand is real, on-camera you, you need far fewer paid media tools than a faceless creator. Authenticity is cheaper and converts better."),
 ])

# 18
add(file="18_50-tasks-to-automate.pdf", kicker="Practical AI", footer="50 Tasks to Automate",
 title="50 Tasks to Automate in Your Business",
 subtitle="A checklist of the real, boring, time-eating tasks AI can take off your plate today - plus a prompt to build the automation.",
 blocks=[
 ("onepager","Don't automate for fun. Automate the task stealing the most hours.",
  ["Scan the list; tick the tasks that actually hurt.",
   "Customer & sales: calls, booking, FAQs, follow-ups, proposals.",
   "Content & marketing: repurposing, captions, scheduling, quote cards.",
   "Operations: inventory, summaries, dashboards, inbox, invoices.",
   "Pick the ONE that costs the most hours - start there."]),
 ("h1","The checklist"),
 ("check",["Answer missed calls / inbound","Book appointments","Reply to FAQs","Follow up with leads","Draft proposals","Repurpose one video into a week of posts","Write captions + newsletters","Schedule cross-posts","Track inventory","Summarize meetings","One dashboard instead of nine tabs","Sort + label your inbox","Generate invoices"]),
 ("h1","Turn a task into an automation"),
 ("step",1,"Pick and build","Start with the biggest time-leak."),
 ("prompt","design my automation","The task eating the most of my time is [TASK]. Walk me through automating it with tools I likely already have: the simplest setup, the steps, and what stays manual. Give me a copy-paste prompt or workflow I can use today."),
 ("callout","The pick","Circle the ONE that costs you the most hours. That's where you start - not all fifty at once."),
 ])

# 19
add(file="19_first-company-gpt.pdf", kicker="Practical AI", footer="Your First Company GPT",
 title="Your First Company GPT",
 subtitle="Set up an AI assistant that actually knows your business - your offers, voice, and FAQs. With the exact setup prompts.",
 blocks=[
 ("onepager","A generic AI gives generic answers. Feed it your business and it becomes yours.",
  ["Gather: offers + pricing, brand voice, top FAQs, ideal customer, your 'never do' list.",
   "Give it a clear job and guardrails.",
   "Put it to work: replies, lead qualifying, onboarding, briefing you.",
   "Keep it fresh whenever an offer or price changes.",
   "It's only as good as its last update."]),
 ("h1","The deep walkthrough"),
 ("step",1,"Gather the knowledge","The AI is only as good as what you feed it."),
 ("prompt","gather my knowledge","Interview me to build the knowledge base for a company AI: my offers + pricing, my brand voice (with 5 example phrases), my top 20 FAQs + answers, my ideal customer and their pain, and what I never want it to say or do. Output it as a clean reference doc."),
 ("step",2,"Give it its job","Clear instructions + guardrails."),
 ("prompt","the company GPT instructions","Write the system instructions for my company assistant: 'You represent [BUSINESS]. Answer only from the facts in this knowledge base, in our voice. If you don't know, say so and offer to connect them to a human. Never [DO X].' Then list 4 jobs it should handle well."),
 ("step",3,"Put it to work","Real tasks, in your voice."),
 ("prompt","draft a customer reply","Using my company knowledge base, draft a reply to this customer message in our brand voice: [PASTE MESSAGE]. Keep it helpful and on-brand; flag anything you're unsure about for me to confirm."),
 ("callout","Keep it fresh","Update it whenever an offer, price, or FAQ changes. A company GPT is only as good as its last update."),
 ])

# 20
add(file="20_complete-bundle.pdf", kicker="The Complete System", footer="The Solo Founder's AI OS",
 title="The Solo Founder's AI Operating System",
 subtitle="The complete bundle: every system to run your whole business with AI - context, content, brand, money, and automation. 20 guides, one operating system.",
 blocks=[
 ("onepager","One person, operating like a team - because the systems carry the load.",
  ["Brain: the AI Chief of Staff + Context Nucleus.",
   "Structure: portfolio org chart + agent delegation.",
   "Reach: the 1-video content engine + posting systems.",
   "Identity: brand-in-a-day + quote cards.",
   "Money + leverage: subscription audit, cancel templates, 50 automations, company GPT."]),
 ("h1","How to use the bundle"),
 ("step",1,"Week 1 - Build your brain","Stand up the systems that hold everything."),
 ("prompt","start the OS","I'm setting up my AI operating system this week. Be my chief of staff: help me build my Context Doc, then give me a simple 7-day plan to stand up the rest (content engine, brand, spend audit, first automation) - one focus per day, with the single first action for today."),
 ("step",2,"Week 2-4 - Layer it on","One system per week beats all at once."),
 ("prompt","this week's focus","It's week [N] of standing up my AI OS. My focus is [content / brand / money / automation]. Give me the 3 moves that matter this week and the prompts to run them, in order."),
 ("h1","What's inside"),
 ("ul",["The AI Chief of Staff + Context Nucleus (your brain)",
        "Portfolio org chart + agent delegation (your structure)",
        "The 1-video content engine + posting systems (your reach)",
        "Brand-in-a-day + quote cards (your identity)",
        "Subscription audit + cancel templates (your money)",
        "50 tasks to automate + your first company GPT (your leverage)"]),
 ("callout","The promise","Every guide stands alone; together they're a company in a box. Run one system a week and in a month you operate like a team."),
 ])

for s in P:
    build(s)
print("TOTAL:", len(P))
