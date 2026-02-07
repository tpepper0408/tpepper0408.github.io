---
title: "Philosophy and Software: Sound Arguments"
description: "Exploring the intersection of philosophy and software development through the lens of making sound arguments."
pubDate: 2026-02-07
tags: ["philosophy", "software", "digressions"]
---

> The software engineer is condemned to be free; because once thrown into the world, they are responsible for everything they do. 
> 
> \- Jean-Paul Sartre (probably)

<br/>
<hr>
<br/>

How many times has this happened to you? Someone asks an innocuous question in a retro, on a PR or sometimes just plonked into slack, and it causes a flourish of opinions, even from those that don't normally have them.
Here's some food for thought (in no way will I be answering these questions...)
- What level of HATEOAS should we be using?
- Is our API truly RESTful?
- What's the right level of commenting?
- Is it more important for this method to be readable or efficient?
- Should we use `<insert shiny new language/framework here>`?
- Standard, airbnb or prettier?
- Which is better: Kotlin, Java or Scala?
- Are we doing DevOps? How would we know if we were?
- Can we take someone seriously if they don't know bitwise operations?

<br/>

I might be wrong here, but I would say there isn't a definitive answer to these questions and anyone who thinks they have one is probably delusional. There are as many approaches to software engineering as there are software engineers, and that is why a PR review can spark debates as trivial and important as anything uttered in the Acropolis. I truly believe there is no defined correct way to approach any technical challenge; we are in charge of our destiny. Software engineers are free to choose how to write software and live with the consequences, it's inescapable, and the consequences are what keep us employed.

<br/>

Many engineers are pedantic; they like to argue over minute details in a code review, and they either love or loathe anything you can think of. It’s impossible to get out of the debate and impossible not to debate code, but there are bad and good ways to go about doing it. 

<br/>

We can learn from philosophers how to approach the marketplace of coding ideas - most philosophers are pedantic too. My degree was in philosophy which is probably why I found a home in engineering. The market for toga-wearing thinkers was surprisingly slim. To make some use of it, here is some practical guidance from the world of logic.

## Sounding logical
> “Contrariwise,” continued Tweedledee, “if it was so, it might be; and if it were so, it would be; but as it isn’t, it ain’t. That’s logic.” 
>
>\- Lewis Carroll, Through the Looking Glass

<br/>

An *argument* isn't a shouting match in philosophy terms, it's how you put across a point. You can make several arguments in a conversation or a debate. Arguments have a structure. It's usually implicit until you break it down. 

<br/>

A *sound argument* (in propositional logic and with deductive reasoning) is an argument with true premises and a valid structure which allows you to make a valid inference from its premises. This is probably logical mumbo-jumbo to you, so here’s a classic example:

<br/>

```
All men are mortal.
Socrates is a man.
Therefore, Socrates is mortal.
```
<br/>

For an argument to be sound, the premises have to be *verifiable* (i.e. we can check if they are true or false) and *true*, and the conclusion has to follow logically from the premises. One of the simplest structures for a valid argument is:

<br/>

```
P → Q
P
∴ Q
```
<br/>

There’s some formal notation in there, let's break it down... if `P` is `true`, then `Q` is `true`, and we know that `P` is `true`, so we can conclude that `Q` is `true` by necessity. `P → Q` and `P` are premises, and `Q` is the conclusion. This form of argument is one of the most basic forms of propositional argument with deductive reasoning (a modus ponens). 

<br/>

We can rewrite the original argument into this form as follows:
```
If Socrates is a man, then he is mortal.
Socrates is a man.
Therefore, Socrates is mortal.
```
<br/>

You can see the basic structure to this argument, and using a similar method you can break any argument down into compound statements with connectives which tell you how the information relates together (it's all very logical). You have the following connectives which may ring some bells:

|Connective|Formal Name|Symbol|
|---|---|---|
|Not|Negation|¬|
|And|Conjunction|&|
|Or|Disjunction|\||
|If … Then|Conditional|→|

Some more examples with valid arguments:
|Example|Formal notation|
|---|---|
|I was born in the UK, and my eyes are hazel.<br>Therefore, my eyes are hazel.|P & Q <br> ∴ Q|
| It's raining, or it's snowing.<br>It's not snowing.<br>Therefore, it's raining.|P \| Q<br>¬ Q<br>∴ P|
|If I am the axe murderer, then I can use an axe.<br>I cannot use an axe.<br>Therefore, I am not the axe murderer.|P → Q<br>¬ Q<br>∴ ¬ P|

And that is how you prove you aren't an axe murderer. 

<br/>

Please note that I've massively simplified this; we've not even touched on first-order or higher-order logic - I sat through two years of "what is truth?" and I don't want to inflict that on you. Also note, there are other forms of reasoning beyond deductive (as Sherlock Holmes will tell you), but despite it's simplicity I find this is a good way to think about what people are saying and whether it makes sense. You can read more at your local library.

## Them's some pretty symbols, but what are you talking about?
The summary is that a *sound deductive argument*:
- Has true premises
- Has a conclusion which follows from those premises (a valid structure)

You can often refactor what people say into these propositional logic statements to check if they're making sound arguments. You can apply this technique to software engineering and it's surprisingly helpful (sometimes). Here's some examples.

### Linting: Faulty Premises
Here's a normal conversation:
```
Fellow coder: "Hey up me duck, this code is unreadable, can you do something about that?"

Coding chum: "Alreet fellow technologist. I think you'll find it passes the linter, I ain't doing a dang thing."

Fellow coder: "Ok, but it is still unreadable. I can't make heads or tails of it."

Coding chum: "We've configured the rules so that the linter checks for readability so it must be readable."

Fellow coder: "That's all good, I must be incorrect. Thank you for your time."
```
The **coding chum** is arguing that their code is readable because it passes the linter. Ignoring how stupid you might think this argument is, we can break it down into a logical form.

|Argument|Formal Notation|
|---|---|
|(Implicit) If the code passes the linting check, then it is readable.<br/>The code passes the linting check<br/>Therefore, it is readable.|P → Q<br/>P<br/>∴ Q|

As you can see, the argument is valid - that is... the conclusion follows from the premises - but the premises are faulty! **Coding chum** implicitly asserts the truth of the first premise to make their argument work. **Fellow coder** made the mistake of accepting the first premise as true. Of course, the definition of 'readable code' is not that it passes a linting check. There is much more to readable code than that!

<br/>

**Top tip**: you can often find implicit premises in an argument, and they are often the weak link. If you can question the truth of a premise, then the conclusion it is based on is also questionable.

<br/>

Use this technique to deconstruct someone's argument in your next normal conversation to wow your friends.

### 500 Errors
We've all been here before:
```
Tech Lead: "Why do you think the database is dropping connections?"

Log-checking person: "I can see logs for 500 status errors with SQL errors and database timeouts, but I can also see successful responses returning the right data too, so it's happening intermittently but there's no other errors coming out, just database timeouts. I've tried it myself and got expected results and errors at different times."

Tech Lead: "OK, let's look at the database."

Log-checking person: "Ok, my illustrious leader."
```
<br/>

So the **log-checking person** is arguing that the database is dropping connections - that's their conclusion. Let's break down the premises. Note that there is an implicit premise in their argument (often, people don't talk like formal logic machines).

|Argument|Formal notation|
|---|---|
|(Implicit) When the database is dropping connections, there are errors related to database timeouts and there's evidence that the database is sometimes serving requests.<br>There are 500 status errors in the logs with SQL errors and hibernate timeouts.<br>The application is sometimes successfully returning data.<br>Therefore, there is a problem with database connections.|P & R → S<br>P<br>R<br>∴ S|

You can see that the argument is in a valid format because if all the premises are true, then the conclusion follows from the premises. It's a bit circular though, you're relying on the implicit premise to allow the conclusion to follow. You can pick apart what they are saying and check for any errors in logic. Usually when you're *investigating* you'll be throwing around theories and trying to see if the evidence matches. For now, they seem to be talking sense, you better start looking at the database!

<br/>

However, there's another version of of events which in my experience is more common...

<br/>

```
Tech Lead: "Why do you think the database is dropping connections?"

Log-checking person: "Last time I saw this error there was a problem with the database, so I think it's the database again."

Tech Lead: "What else is making you think it's the database?"

Log-checking person: "Well, I haven't checked anything else, but I know the database is a bit temperamental, so it must be that."

Tech Lead: "Ok, let's look at the database."
```
Can you spot what's happened here? The **log-checking person** has made a generalisation. They have jumped to a conclusion based on insufficient evidence. They haven't even checked the logs properly! If we break it down it could look something like this:

|Argument|Formal notation|
|---|---|
|I have seen errors like this before and they happened when the database was dropping connections.<br/>The database is temperamental.<br/>Therefore, the database is dropping connections.|P<br/>Q<br/>∴ S|

They are relying on their past experience to make an assumption about the current situation, which is a common cognitive bias. The second premise is a feeling, not a verifiable piece of information. This is a bad argument because there isn't enough information to determine that the conclusion follows from the premises *and* it's based on an unverifiable premiss. Loose logic, in my experience, is a common problem in software engineering. It can lead to wasted time and effort chasing the wrong thing.

## Penguins Can't Fly
Often the best way to learn is to see bad examples. There are many ways you can make a bad argument but let's start with the fun one.

### False Premises
```
All birds can fly.
Penguins are birds.
Therefore, penguins can fly.
```

A common way to fall foul is untrue premises, "All birds can fly" is false. Although the penguin argument is valid, it doesn’t work because it has a false premise. If you can question the truth of a premise, then the conclusion it is based on is also questionable.

### Unverifiable Premises
```
Cool birds can fly.
Penguins are cool.
Therefore, penguins can fly.
```
<br/>

This argument is also valid, but the premises are unverifiable. What does it even mean to be a "cool bird"? It's not something you can check or verify. If you can't verify the premises, then you can't be sure if the conclusion is true or not.

#### What do I do?
The first thing to do is to check that what has been said is based on evidence, that is... verifiable and true. For example:
- what evidence are they using to come to their conclusion?
- does that evidence stand up to scrutiny?
- has the person assumed anything about how things work?
- have they read the artefact properly?
- do they know the way the application should work?
- is the behaviour replicable?

Don’t assume things; gather as much information as possible, and ensure your monitoring, logging, and other information sources are as detailed and unmistakable as possible. Be wary of statements that cannot be verified or haven’t been. If you have reliable information, you can be more confident in your conclusions.

<br/>

There's a reason software engineers like KISS and it's applicable to the way we reason too! The more complex the argument, the more likely it is to have a false or unverifiable premise. The more complex the argument, the more likely it is to be invalid. The more complex the argument, the more likely it is to be wrong. Keep it simple, and keep it sound.

## But there's more...
That’s just the start of the story. You know there are two parts to a sound argument:
- Has true premises
- Has a conclusion which follows from those premises (a valid structure)

We've covered the easy one - false premises. There are so many ways an argument can be invalid... find out more soon!