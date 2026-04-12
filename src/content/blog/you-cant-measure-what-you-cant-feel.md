---
title: "You Can't Measure What You Can't Feel: Returning to DevEx"
description: "DevEx is too abstract. It's not about metrics, it's about how it actually feels to use your tools."
pubDate: 2026-04-12
tags: ["return-to-engineering", "developer-experience", "engineering-craft"]
---

This post is part of the [Return to Engineering](/tags/return-to-engineering) series, where I share my journey of returning to hands-on software engineering.

## Fighting the Wrong Problem

I turned off code generation while doing some katas. I wanted to see what it felt like to write Java without my safety net.

<br/>

It was supposed to be a fun exercise, small problems in a language I know well. This should have been easy.

<br/>

I wanted to extract a variable and my fingers froze. I couldn't remember the shortcut. I pressed the wrong keys. IDEA did something I didn't expect. I undid it. I looked up the shortcut but then forgot a couple of times. 

<br/>

I wasn't solving the kata, I was fighting my own tools. The IDE and keyboard were suddenly conspicuous and I wasn't thinking about the problem anymore.

## Bracketing Experience
You can't feel another person's experience, but you can get closer than metrics ever will by using *bracketing*. This means setting aside preconceived notions and trying to understand the experience as it is without trying to judge or measure it.

<br/>

For example: When I play the piano, the moment I think about my fingers, the music escapes me. Jittery, out of sync, hesitant and unsure, I'm not playing any more. I'm thinking about playing.

<br/>

![An image of a person playing the piano and feeling the music but experiencing mistakes and friction with a bad note.](../../assets/images/devex/DevExPianoPlayer.png)

<br/>

Coding is no different. Here are some experiences that might feel familiar.

### Renaming
I want to rename a variable, I press the buttons but it doesn't work, I'm not sure why. I resort to find/replace. I feel like I might have missed a reference. I spend extra time reading through the changes. The short activity of renaming has turned into 5 minutes. I have forgotten what I was doing.

### Following references
I want to find out how a method is implemented. I click on the method name and it takes me to the interface, not the implementation. I can't figure out the shortcut to see it. I've now got many tabs open and I have to navigate between them to build up my mental model of the code. I'm lost and I've spent 10 minutes reading irrelevant code.

### Review Feedback
I submit a PR, I'm nervous about it. I can't make sense of some comments made on the PR. I send them a message to ask for clarification and they don't respond for a few hours. I work on a different task while I wait, and when they finally respond, I don't understand what they want from me. I've now got three tasks on my plate and this PR is hanging over me.

## Stepping Back

![A leader thinking about metrics and graphs and ignoring a person having a bad experience.](../../assets/images/devex/DevExTooAbstract.png)

<br/>

I've used metrics like *cycle time*, *lead time*, *build times* and so on. I've also used qualitative feedback, usually to find trends. It doesn't capture what I'm talking about. What about the feeling of frustration when you have to wait for a build to finish before you can test something? Or the feeling of never being able to finish a piece of work because flaky tests keep popping up? What about being forced to use a tool that doesn't work for you? 

<br/>

**Flow** and **cognitive load** are useful concepts but the way I find myself talking about them makes them appear like abstract concepts that only exist as detriments to productivity.

<br/>

I found myself trying to capture this by asking my team to rate their experience with our tools. I thought this would give me a good sense of the friction they may be feeling but it was still too abstract. 

<br/>

**Experience is hard to quantify if you're not the one having it.**

<br/>

Asking vague questions won't capture the nuances of someone's experience. As a leader, you are creating the ecosystem for your team to create software. If you don't get under the hood you are in danger of enforcing an experience on to your team that doesn't work for anyone. I was trying to improve an experience I wasn't actually having.

## Ready-to-Hand DevEx

If I spend my time measuring DevEx, I won't be able to understand the actual experience of using the tools available to my team.

<br/>

I need to give actual experiences the room to breathe without trying to judge or measure it. By abstracting away from actual experience, you lose something fundamental about what’s causing problems. We can flip this on its head: experience itself is the data.

<br/>

I think the true measure of good tooling and good DevEx is how invisible the tooling is for you, as an engineer. It has to be grounded in the lived experience of writing code. The scale is from invisible (*ready-to-hand*) to obvious (*present-at-hand*). Good tools disappear, bad tools become the thing you think about.

<br/>

Asking more nuanced questions about tooling may help us try to measure the experience without trying to quantify it. For example:
- How often do you feel like your IDE is getting in your way?
- What causes you to get distracted?
- When did you last feel like you were in a flow state and what were you doing?
- What processes take you away from finishing a task?
- Do you notice your tools when you're using them? If so, how do they make you feel?

Engineers try to solve friction all the time - I know a lot of developers with unique and intricate setups designed to work around the limitations of their tools. In my view, part of being a leader is trying to solve these problems to make the experience better for everyone. Metrics might tell you something is not working so well, but pulling at the thread of the actual experience may tell you what you can do about it.

<br/>

![An image of a person combining metrics with spending time with developers on their experience and pain points.](../../assets/images/devex/DevExCombined.png)

<br/>

Asking how **ready-to-hand** the experience is for your team is a much more immediate way to understand how good your DevEx is. 

## The Craft of DevEx
When it comes to solving sources of inefficiency, I got more insight from an hour of writing code than weeks of looking at metrics. When developers complain about their tools, they are highlighting friction. Somehow I forgot this by getting caught up in abstract measures. *I knew all this and I forgot it.*

<br/>

Friction is uncomfortable and sitting with it is hard. Your team are experiencing it in every change they do. Paying attention to what doesn't feel right, and experimenting to find something that feels better is a craft in itself. I want invisible tools for me and my team.

<br/>

**The moment your attention shifts from the problem to the tools, DevEx has broken.**

<br/>

Well, back to practicing...