---
title: "Prototyping with teenagers"
description: "A reflection on the experience of an Introduction To Engineering for work experience students by using prototyping and whiteboarding."
pubDate: 2026-03-13
tags: ["ai", "software-engineering", "prototyping", "teaching"]
---

I spent some time this week with some work experience students in sixth form. It was only 2 hours but I was given the task of giving them an *Introduction to Engineering*. Thinking through what to cover and how to cover it landed me on a mixture of prototyping and stepping back to cover wider engineering concepts. I thought it would be interesting for others to see how I approached this and what I covered.

# Deciding on the format

What do I know about 16 year olds? I know that they are likely to have a short attention span, and that they are likely to be more interested in practical activities than theoretical ones. I also know that they are likely to be more interested in technology than in traditional engineering disciplines. With this in mind, I decided to focus on prototyping as a way to introduce them to engineering concepts. I also decided to use a mix of hands-on activities and discussions to keep them engaged.
<br/><br/>

![A whiteboard with a diagram of the prototyping process](/images/work_experience/WorkExperiencePlanning.png)

<br/><br/>
I landed on:
1. **An LLM project brief:** A Claude project which was set up to prompt questions about the product they wanted to prototype and resulted in a product specification and a technical specification
2. **An MVP slice:** Using Cursor to create something tangible from the project brief, and to show how to iterate on it.
3. **Whiteboarding:** whilst Cursor did its thing we talked about what it actually takes to get a product from an idea to the customer's hands, and the different roles that are involved in that process.

# The project brief

![A group planning a product together in front of a whiteboard](/images/work_experience/WorkExperienceProductPlanning.png)

I spent some time designing this part so that it would be interactive and help the students understand what sorts of questions you need to ask when you are trying to engineer software. I let them choose the project they wanted to do, and they chose to build a "social media platform for pets". I then used a Claude prompt to generate a project brief for them, which included a product specification and a technical specification. I then went through the project brief with them, asking them questions about the different sections and encouraging them to think critically about the requirements and constraints of the project.

## Claude Project Setup

The first thing I did was ask Claude to help me set up the Claude project. I learnt something straight away, you have to be way more specific than my initial attempt!

```
Can you help me create a sensible set of instructions for this project?

I'd love to help you create project instructions! Could you tell me a bit more about what you have in mind?Also, feel free to describe the project in as much detail as you'd like — the more context you give me, the more tailored the instructions will be!

Q: What type of project is this?
A: Software / coding project

... more questions later ...

Here's a solid set of project instructions tailored for a solo JS/TS project starting from scratch:

🛠 Project Instructions
1. Setup & Installation

Use Node.js LTS (v20+). Use nvm to manage versions — include a .nvmrc file in the root.
Use pnpm (preferred) or npm for package management. Commit a lockfile (pnpm-lock.yaml or package-lock.json).
Copy .env.example to .env and fill in required values before running. Never commit .env.
Run pnpm install after cloning, then pnpm dev to start locally.
...
```

<br/>

I had accidentally left out that I wanted instructions for a *Claude project*. So it gave me a set of instructions to set up a Typescript project. Not what I wanted!

Let's try that again...

<br/>

```
Ah ok, think we've misunderstood each other here. I'm looking to put into this Claude project a sensible set of project instructions so that when I use this for a live demo as part of a work experience workshop, it responds in an appropriate way with the right tone etc

Ah, got it! You want to set up the system prompt / project instructions for a Claude project that will be used in a live work experience workshop demo.
```

<br/>

Now we're getting there! It ended up with something sensible after some follow-up questions... the full project instructions I ended up with are available here: [Claude project instructions](/resources/workshop-claude-project-instructions).


## On to the workshop

![Initial Claude Prompt and response](/images/work_experience/ClaudeInitialPrompt.png)

<br/><br/>

The students settled on a game night application. Claude then went on to ask some really sensible questions that led to a lot of discussion from the students.

- Who is the main person using this app?
- What platforms should this run on? 
- Is this for a group of friends who game regularly, or more for one-off events?
- How should users log in or identify themselves?
- What features are most important?
- What's the rough timeline for delivering this project?

These questions drove a really good discussion about the different types of users and their needs, and how that would impact the design of the app. We also talked about the different platforms that the app could run on, and how that would impact the development process. They settled on a web app that would be used by groups of friends who game regularly - their reasoning was that a web app would be more accessible and easier to use than a mobile app. It was great to see them thinking through these questions and coming to a consensus on the direction of the project.

<br/><br/>

![The project summary generated by Claude](/images/work_experience/ClaudeProjectSummary.png)

<br/><br/>

The great thing about this approach is that it felt very much like the project was in their hands and they were contributing to the final product. It also led to a lot of discussion about the different aspects of the project and how they would approach it. I was really impressed with the level of engagement and the quality of the discussion that was prompted by Claude.

<br/>

The output of this was a product specification that we could read through and agree to. Then a technical specification that would jump us off into part two of the workshop - building an MVP slice.

<br/><br/>

The full files generated by Claude are available here:

- [Product specification](/resources/workshop-claude-generated-product-spec)
- [Technical specification](/resources/workshop-claude-generated-technical-spec)


Just a couple of notes on the technical spec before I move on. This table really drew out some conversations on the understanding of the different layers of the tech stack and what they do. It also prompted some good questions about why we would choose one technology over another, and what the trade-offs are. 

| Layer | Technology | Reasoning |
|---|---|---|
| Frontend | **React** | Component-based UI suits the multiple interactive views (scheduling, voting, leaderboard). Large community and easy to find help. |
| Styling | **Tailwind CSS** | Utility-first CSS framework that makes mobile-friendly design fast to build |
| Backend | **Node.js + Express** | Lightweight and beginner-friendly. Well suited to a simple REST API. |
| Database | **PostgreSQL** | Reliable relational database — good fit for structured data like sessions, players, and votes |
| Hosting | **Render or Railway** | Free tiers available, simple deployment, good for MVPs |
| Unique links | **UUID generation** | Each group gets a unique ID baked into their URL (e.g. `/group/abc123`) |

The system architecture diagram also prompted some good discussion about how the different layers of the tech stack interact with each other, and what the responsibilities of each layer are.

```
┌─────────────────────────────────────────┐
│              User's Browser             │
│           (React Frontend)              │
└───────────────────┬─────────────────────┘
                    │ HTTP Requests (REST API)
                    ▼
┌─────────────────────────────────────────┐
│         Node.js / Express Backend       │
│              (REST API)                 │
└───────────────────┬─────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│            PostgreSQL Database          │
└─────────────────────────────────────────┘
```

It started small with "what is a client vs. server vs. database?" and then moved on to "why do we need a backend at all? Why can't the frontend just talk to the database directly?" which led to a discussion about security and separation of concerns. It was great to see the students engaging with these concepts and asking questions about how everything fits together.

# Building an MVP slice

![Cursor generating code for the project](/images/work_experience/CursorCodeGen.png)

<br/><br/>

I've used Cursor in this way before and found it a good starting point, especially when you give it a detailed brief and direction. I wanted to show the students how you can take a project brief and turn it into something tangible, and then iterate on it. They knew about Replit and ChatGPT, but things like Claude and Cursor were new to them. 

![Prompt to Cursor which asks it to create an MVP slice with some initial responses](/images/work_experience/CursorInitialPrompt.png)

<br/>

This was a bit of a whirlwind for them, but they were really engaged and interested in seeing how Cursor would approach the problem. In retrospect, I think it would have been better to simplify the tech stack to something a lot more digestible for a beginner! The technical spec was really comprehensive and the first attempt from cursor included a front end, back end and database. At least it led us to talk about why you need them all and what they do, but the code is a bit much for a beginner to take in all at once.

<br/> 

For example, our CreateGroupPage function in the App.tsx file ended up looking like this:

```tsx
function CreateGroupPage() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (!res.ok) {
        throw new Error('Failed to create group');
      }
      const group: Group = await res.json();
      navigate(`/group/${group.id}`);
    } catch (err) {
      setError('Could not create group. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">Game Night Organiser</h1>
          <p className="text-sm text-slate-400">
            Create a shared link for your group. No logins, just one URL everyone can use.
          </p>
        </header>
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg shadow-slate-900/60"
        >
          <div className="space-y-1.5">
            <label htmlFor="groupName" className="block text-sm font-medium text-slate-200">
              Group name
            </label>
            <input
              id="groupName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="e.g. Wednesday Board Gamers"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full inline-flex items-center justify-center rounded-lg bg-emerald-500 px-3 py-2 text-sm font-medium text-slate-950 hover:bg-emerald-400 disabled:opacity-60 disabled:hover:bg-emerald-500 transition-colors"
          >
            {loading ? 'Creating…' : 'Create group link'}
          </button>
        </form>
        <p className="text-xs text-slate-500 text-center">
          You&apos;ll get a unique URL you can paste into your group chat. Anyone with the link can join.
        </p>
      </div>
    </div>
  );
}
```

The best I could do to help them understand this was to change the text visible on screen and show them how to hot reload the changes. It felt tangible but it blew their minds beyond the initial excitement of seeing their ideas on the page.

<br/>

There's some good stuff to talk through like error handling, loading states, API calls, forms, state management. It's maybe something you'd want to go through with someone that's wet their beak a bit more. I did make it somewhat interactive by asking them what they wanted to change and then showing them really obvious ways to change it (e.g. text changes and colours). I also dug into the HTML on the developer tools and slowed down the network to show them loading states and walked through the network calls and what they were doing.

<br/>

![Group Creation Page with basic styling and some spacing issues](/images/work_experience/WorkExperienceCreateGroup.png)

<br/>

It was also *ugly as sin* which led to a good discussion about the importance of design and user experience, and how that can impact the success of a product. We talked about how you might go about improving the design, and what tools you could use to do that. I admitted to them that I'm not a front end guru and making it look pretty was not going to be a fun activity for us all to experience! I think the next time I do this I'll need to think about how to ensure the tech stack is simple enough for them to engage with it but also flexible enough to show them how to iterate on it and make it their own. Ideally, I want something that would look good out of the box so the ugliness doesn't distract from the excitement of seeing their ideas come to life on the screen.

<br/>

I've found when I've used cursor like this before it can end up with functional but ugly results. Claude code is pretty good for getting something a bit more attractive out of a prototype - but I think the main problem was that I didn't actually *ask* cursor to make it look pretty!

## The limits of AI
One thing that's clear with 16 year olds is that they are tech-savvy and AI-aware but they have limited exposure to tools outside of a few mainstream things like ChatGPT (massive generalisation I know but bear with me). Thinking about their experience as burgeoning technologists in 2026 makes me feel nostalgic for pulling apart PCs to build something that could play Oblivion without melting whilst chatting on MSN messenger to my friends. How time flies!

<br/>

Coming of age in the LLM era is going to be entirely different to entering into the tech market when things like bitwise were considered mandatory knowledge for a software engineer. These code generation tools are a good bridge into software development but I was conscious not to give the impression that it was just about vibing! One thing to be conscious of is not to leave an impression that AI is *all there is* to getting a product out to market. It's a huge topic in the industry right now, just go on reddit and you'll see countless posts about how to deal with the pressure to use AI against all wisdom and experience. 

<br/>

This is why I took it back to the whiteboard and talked about getting some code into production in the real world.

# Whiteboarding

![Whiteboard diagram of the software development process](/images/work_experience/WorkExperienceWhiteboarding.png)

I tried to break down the process from when you start typing code through to when you get something out into the wild. Broadly, I broke it down into 4 stages with specific purposes:
1. **Development:** writing clean code and making sure it matches your standards
2. **Testing:** making sure your code works and doesn't break anything else
3. **Verification:** making sure your code does what it's supposed to do and meets the requirements
4. **Deployment:** getting your code out to users and making sure it runs smoothly in production

I asked throughout, what do I need to worry about when I get to this point? How might I do this? Who would do this sort of thing?

<br/>

Talking about specialisms is where I could see their cogs turning. They found it really interesting that someone might write software to test software but when I explained that otherwise you would have to test everything manually every time, they understood the value of it. Deployment was a deep well that opened up conversations about where it goes, how it gets there, who does it.

<br/>

Verification was when I honed in on performance, security, accessibility and all the non-functional requirements that are often overlooked by new developers. I wanted to make sure they understood that it's not just about writing code that works, but writing code that works well and is usable by everyone.

## Unexpected Questions
One thing I love about doing these sort of learning sessions with younger people is that they ask some really good questions that give you pause. You get so wrapped up in jargon and techno-babble when you work in tech that you sometimes neglect to step back and think about how to explain some of the concepts and concerns involved to a non-technical audience. Even product owners, delivery managers and other less technical roles are expected to have a baseline understanding of the software development process and the different roles involved, so it's important to be able to explain these concepts in a way that is accessible and engaging.

Here are some examples:
- "How do you make sure nobody sees your data?"
- "What is the cloud?"
- "What happens if someone is blind?"
- "What is a platform engineer?"

These questions led to some really good discussions about security and data privacy, accessibility, and the different roles involved in software development. They gave me a proper workout!

# Wrapping up

I hope I created a room of technologists out of the introduction but at the very least I hope they came away with an idea about what engineering is all about and how exciting, creative and collaborative it can be. I also hope they understand that it's not just about writing code, but about solving problems and creating things that people will use and enjoy. 

<br/>

Despite it being quite advanced for them, I could see them googling concepts as we went along and really wanting this product to work. They were invested and that was great to see! I wasn't quite sure what to expect from a group of teenagers but I was pleasantly surprised!