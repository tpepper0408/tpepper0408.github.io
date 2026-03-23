---
title: "When Code Plays Itself"
description: "AI hasn’t simplified software development - it’s moved the complexity somewhere we’re less prepared for. How can you orchestrate a team of player piano players?"
pubDate: 2026-03-23
tags: ["software-engineering", "return-to-engineering", "technical-leadership", "ai", "team-building"]
---

This post is part of the [Return to Engineering](/tags/return-to-engineering) series, where I share my journey of returning to hands-on software engineering. 

# The Player Piano
I sat down to write some code recently, and it felt a lot like sitting down at a piano I used to know well. Except this time, I wasn't playing it. I'd turned on a player piano.

<br/>

A player piano is jarring. You might feel surprised at first, impressed maybe, then probably bored. It's an intricate machine, but it's not anything like playing it yourself or even watching another person play. Live performance has expression, mistakes and intentionality - it's alive. Playing the piano is visceral, playing a player piano is like switching on a washing machine. 

![A player piano producing music and software.](/images/code_plays_itself/PlayerPianoCode.png)

<br/>

What if your very livelihood depended on playing that instrument - and now it's playing itself? That's how I felt when I started using AI code generation tools. It's a player piano that I prompted to "play itself" and it did *something* that I couldn't quite articulate. I didn't know if what it was playing was correct. The music is there, but my connection to it is different. Player pianos are impressive, but they also make me question a lot of things.

- What am I now? I'm not a piano player!
- How do I know if the music it's playing is good, bad or even the correct song?
- What happens when the piano plays something I don't want, how do I stop it? How do I fix it?
- What about my team? Are they still playing the piano, or are they playing player pianos?
- How do I orchestrate a bunch of player piano players?

<br/>

When I'm using AI code generation, I can create something pretty good without much effort on my part - but I don't trust it. It looks about right but I need spend time unpicking what it's done, what choices it has made, and whether they are good choices. The good thing is that I can ask it what the code means, but I can't ask it *why* it has written the code in the way it has - it isn't a human. It's very tempting to use codegen to get code out the door, especially when I'm coming back to hands-on engineering - but it presents a different set of challenges and feels very different to writing code myself.

## What Leaders Are Experiencing

The [Lead Dev Engineering Leadership Report 2025](https://leaddev.com/the-engineering-leadership-report-2025) found that unease about generative AI's long term impact rose to 49% across engineering leaders. Alongside that, attitudes were mixed - with 72% being concerned about the quality of the output, around 50% were concerned about security threats and code maintainability but 65% said they were excited about the positive influence it may bring.

<br/>

The report suggests that AI tooling is being rapidly adopted but productivity gains are being realised whilst concerns about quality and security are rising. It suggests something subtle is happening - we're generating more code but shifting the bottlenecks somewhere else. It's a complex picture that goes to the heart of how I feel about all of this. **Conflicted.**

<br/>

On one hand, I love that I can create things quickly and test my ideas - create boilerplate code and free my mind up for thinking, coaching and learning. On the other hand, I have seen quality drop - I have seen my team do things because an AI told them to without understanding why. I have experienced the toll on senior engineers to catch *more* mistakes and issues. I have seen the impact of unclear requirements - where a task is done to the letter of what you've asked for without questioning what you actually wanted or challenging the overall approach and design. 

<br/>

Like a cacophony of player pianos playing different songs - I stand back trying to make sense of it but all I hear is noise. How can we make sense of it?

![Many player pianos creating lots of music and code in a chaotic way.](/images/code_plays_itself/PlayerPianoSymphony.png)

# The Hourglass

<img
  src="/images/code_plays_itself/PlayerHourglass.png"
  alt="An hourglass with people planning at the top, someone reviewing a lot of data at the bottom and a thin middle where code and sand pour through"
  style="float:left; width:min(38%, 280px); margin:0 1.25rem 0.75rem 0;"
/>

I came across [The Cloud Girl](https://www.thecloudgirl.dev/)'s [SDLC Hourglass](https://www.youtube.com/watch?v=VUwZOdhA1bQ) recently and it helped me make sense of the changes I am seeing in my team.

- The **top** represents the planning and design phase of software development, where requirements are gathered, and the overall architecture is designed. 
- The **thin middle** represents the implementation phase, where engineers write code to implement the planned features.
- The **bottom** represents the verification phase, where code is reviewed, tested, and maintained over time. 

The middle is so thin now because AI code generation tools can go so quickly that it feels like the coding phase is almost instantaneous. It *used to be slower* and that brought some value.

When you developed slowly, you could question requirements, think about how to test it, work through the low-level design and ensure it matched the current codebase and previous decision. I really believe that writing code is an iterative reading, interpreting, adjusting and refining process that produces deep understanding. Diving deep means sometimes you challenge back on some assumptions made, or alternatively you plug gaps in analysis and design to make pragmatic decisions. You also learn and come to understand the system more deeply so that you can feed back into the overall product.

<br/>

Now, with AI code generation, you can go from requirements to code in seconds. This means that the planning and design phase becomes more critical than ever as you're missing that human, interpretive element in the implementation phase. Moreover, the verification phase becomes more important, as it ensures that the generated code is of high quality and meets the requirements. Even if you designed the code well, you may not have prompted the AI correctly - or it could have hallucinated or done something against the overall design of the system. It means a very different landscape to a traditional agile team where the *implementation* would derisk the design and think forward to the deployment and maintenance of the code.

<br/>

We've been trying to make implementation faster for years, but now it can be so fast the constraints on producing quality software move to the top and bottom of the overall process.

<br/>

**We didn't remove the hard parts - we just moved them somewhere we're less prepared for.**

<div style="clear:both;"></div>

## The Hourglass In Practice

An agile development team - in my experience - is often focussed on people to do the middle of the hourglass - i.e. the implementation phase. You can debate what is in there, with code, platform, test automation and so on - but the focus is on more *doers* than *thinkers* or *reviewers*. Engineers expect well-defined tickets and some standards to work towards. They are often not involved in the prospective design phases and rely on others to review their code and catch their mistakes. Usually there are seniors that do the heavy lifting so that juniors can learn and grow.

<br/>

What does it look like at the top of the hourglass? You have product managers, designers, architects or technical leads who are responsible for gathering requirements, designing the system and making sure that the implementation is aligned with the overall vision. They need to be able to think critically about the requirements and design - and they need to be able to communicate that effectively to the doers.

<br/>

What does it look like at the bottom? You have code reviewers, testers and maintainers who are responsible for ensuring that the code is of high quality, meets the requirements and is maintainable over time. They need to be able to think critically about the code and provide feedback to whoever implemented a feature.

<br/>

**Note:** these roles are not always different people, a tech lead can quite often perform both ends of the hourglass, and in some cases, engineers can be involved in all phases of the hourglass.

<br/>

The theme throughout this is - **critical thinking**. If you concentrate on the top and the bottom of the hourglass, the people you need to do that are senior, experienced, critical thinkers. If you send a load of code through the hourglass, you need to have the right people to review it - or you have a new bottleneck. 

# Salting the Ground: Stunting the Talent Pipeline
LeadDev also reported that concerns about the impact of generative AI on junior developers entering the tech industry rose to 54% across engineering leaders and that 33% were concerned about what impact it will have on roles available for engineering in the future.

<br/>

What happens when you lose the hermeneutic circle of writing code? I think you fundamentally lose one of the main sources of growth and learning for junior engineers. You can read code, but you don't get the same level of understanding as you do when you write it yourself. You don't get the same level of understanding of the system, the design decisions, the trade-offs and the overall architecture. You also don't get the same level of understanding of how to write good code - how to structure it, how to test it, how to maintain it over time.

<br/>

If you have a team of player piano players, you have a team of people who are not learning and growing in the same way as they would if they were writing code themselves. They are not developing the same level of critical thinking and problem-solving skills that they would if they were writing code themselves. They are pressing play and hoping for the best.

<br/>

Over time, this could mean *fewer* people with the skills to verify AI generated code and a dwindling workforce of those that can!

## Getting Sloppy
If you don't invest in the planning and design - or crucially think about *how to successfully prompt an AI to write the code you want* - then you create lots of bad code very quickly. If you don't have experienced engineers to spot it and course correct then you have **slop**.

<br/>

What happens when the experienced engineers are too busy to deal with the slop? Or when they are fed up of being the blocker to getting features out of the door? They are the difficult one who keeps pushing back on the plucky junior who generated 10 days worth of code in a couple of hours. They are the one who is saying "we need to slow down and do this properly" when everyone else is saying "look at all this code we have, we can ship it now". It's not comfortable being that person, and it goes against the very messaging that stakeholders might have heard about the benefits of AI code generation.

<br/>

**Right now, AI code generation works because experienced engineers are quietly correcting it. That doesn't scale.**

<br/>

Part of this might be nostalgia, but I've seen enough slop recently to believe it's something we need to take seriously.

# Orchestrating The Player Piano Players

![An orchestra of player pianos, with a conductor orchestrating them and a giant hourglass in the background.](/images/code_plays_itself/PlayerOrchestra.png)

Maybe we need to think about the sorts of team that would fit into this hourglass model. Thinking about what happens when implementation is instantaneous has highlighted, to me, that we hide a lot of sins in the planning phase, and spend some of our implementation time frontloading the verification phase. If we have a team of player piano players, it's more about ensuring they have the right prompts and feedback loops to ensure the music is anything but noise.

<br/>

A team might look more like this:
- **Context shapers (Top):** people that focus on requirements gathering, constraints and clarity. They are responsible for ensuring the context that an AI code generator works within is well defined.
- **AI-assisted builders (Middle):** experts in the codebase and the prompts needed to get the right code out of the code generation. They are responsible for ensuring the code generated is of high quality and meets the requirements.
- **Validators (Bottom):** people with deep engineering experience that can review the code and check for its maintainability, security and overall quality.
- **Feedback loopers (Alongside):** people that focus on documentation and knowledge sharing and feed that back into the context shapers and builders to ensure that the AI code generation is improving over time and that the context is evolving with the codebase.

The experience level in that sort of team is high, and it has fewer people in the *doers* category than a traditional agile team. It's a different skillset than what I'm used to, but I don't think we can get past the idea that *critical thinking* is needed throughout the AI SDLC. The team hasn't shrunk, the roles needed have stretched to the top and bottom of the hourglass.

<br/>

I'm not sure where juniors go in this model, but I think they can be involved in all areas - they just need to be supported and mentored by more experienced engineers. They can learn how to write good prompts, how to review code and how to think critically about requirements and design. They can also learn how to maintain code over time and how to ensure that the code they generate is of high quality. We need them to land somewhere in the new team shape!

<br/>

**If we don't figure out the path to senior in an AI code generation world, we risk creating teams that create code faster than they understand it.**

# Being Played by the Piano

AI code generation has gotten surprisingly good in the last couple of years. I remember the frustration of trying to get GitHub Copilot to write the code I wanted, fast forward and I can give something like Cursor a document with requirements and it can create a running application for me.

<br/>

I created a quick project with some [work experience students](/blog/2026-03-13-work-experience-prototyping) recently and I realised I had made a mistake with the requirements. I had mountains of code to unpick to fix it. That was humbling to do in front of students as suddenly you have a codebase to read and debug that didn't exist a few minutes ago. I felt that I *should* understand all of this code and that pressure is something that senior engineers are forced into when they are sent slop to review. It's a little alarming how quickly that has become so ubiquitous.

<br/>

I recently had GitHub Copilot help me review some of my team's code and it was nitpicky but correct. When I asked it to rewrite some spaghetti code, it did a really good job but also added a *lot* of unnecessary comments. We haven't cracked how to tell it what we need from it yet, and in this interim period it's just giving me more work.

I feel like there's no way around it, if I don't invest the time to understand how to rein in this era of slop I'll just keep trying to make sense of the noise - and player pianos need someone to understand them to make sure they are playing anything coherent. I can't help but feel that AI is playing me as much as I'm playing it.

<br/>

Maybe the craft of engineering isn't disappearing, it's changing. I'm going from playing the piano to conducting it.

<br/>

Well... back to practicing... the part that AI can't do for me.

<br/><br/>

<hr/>

This post is part of the [Return to Engineering](/tags/return-to-engineering) series, where I share my journey of returning to hands-on software engineering.
