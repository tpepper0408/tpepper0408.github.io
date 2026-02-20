---
title: "Philosophy and Software: Bad Arguments"
description: "Part 2 of Philosophy and Software, turning to some of the bad arguments you might find in tech."
pubDate: 2026-02-21
tags: ["philosophy", "software", "digressions"]
---

In my previous blog (see [Part 1](./2026-02-07-philosophy-and-software-sound-arguments)), I explained what a good argument looks like and explained the easiest way to make a bad argument (by having false premises). To recap there are two parts to a sound argument:
- Has true premises
- Has a conclusion which follows from those premises (a valid structure)

This blog is about invalid argument structures and the more subtle ways you can argue badly. But before we begin...

## Being a good software citizen
> Be kind; Everyone you meet is fighting a hard battle.
>
> \- Plato ([not really](https://quoteinvestigator.com/2010/06/29/be-kind/), but it’s a nice quote)
>

It's tempting, once you know that people are arguing badly, to call them out on it gleefully. Don't be so arrogant!
<br/>
Be **kind**. Everyone makes mistakes, and everyone should be healthily challenged too. You can ask people to clarify nicely without trying to 'win', especially in public settings. We're all human, and we're all responsible for our actions.

## Invalid Arguments
### Jumping to a conclusion
![An image of a figure jumping over a chasm with a lightbulb, ignoring the evidence around them.](/images/InvalidArgumentConclusionJump.png)
<br/>

Can you spot the problem with this argument? 
<br/><br/>
```
If Socrates were a man, then he would be mortal.
Socrates is mortal.
Therefore, Socrates is a man.
```
<br/><br/>

It looks like it’s got a valid structure, but it doesn't. The problem here is that the conclusion *does not follow the premises*.
<br/><br/>

Let's start with premise 1: you know if Socrates were a man, then he would be mortal. Part of the definition of being a man is that you are mortal. So far so good. The problem comes when we get to premise 2... you know that Socrates is a mortal, however, you don’t know enough information to determine that Socrates is a man from those two pieces of information. 
<br/><br/>

Why is that? Well... Socrates could be a woman, non-binary or even a goat, for all we know. Mortality is not the domain of men, it belongs to many creatures great and small. This particular mistake has got a name called *affirming the consequent*. You can see the form and how it differs from a valid form.

| Valid Form | Invalid Form |
|------------|-------------|
| P → Q<br/>P<br/>∴ Q | P → Q<br/>Q<br/>∴ P |

<br/>
You might call this one *jumping to a conclusion* and it is quite a common logical error. You should be able to spot someone doing this, if they work backwards trying to find the root cause of an issue, they might jump from the evidence they can see back to a root cause. 
<br/>
For example:

| Argument | Form |
|----------|----------------|
| If there’s a problem with the database configuration, then it will return 500 errors.<br/>The service is returning 500 errors.<br/>Therefore, there’s a problem with the database configuration. | P → Q<br/>Q<br/>∴ P |

This isn't valid, we need more information to make that leap of logic. We’ve got to the conclusion by working backwards, but just because one thing leads to another, it doesn’t mean the reverse is true. That’s why this is sometimes called the *converse error* or fallacy of the converse. Working backwards is a common way to investigate problems, but be careful not to jump to conclusions when you're doing it!
<br/><br/>
One unfortunate weekend when I was on call after a release, there was a problem with a SQL query that was missing a WHERE clause, causing database locks that escalated to the point where all users were queuing on the server. It wasn't immediately obvious, there were lots of errors happening and they turned out to be consequences of the locks, queuing and then hanging connections backing up. If we had jumped to a conclusion about the cause of the issue, I may have spent ages fixing symptoms and never fixing the problem - in fact we did, it took a while to find out some errors were hiding other errors. 
<br/><br/>
I've seen it happen time and again; when I worked on a support team a few years ago, I saw people fix bugs and release them without ever figuring out that the logs weren't pointing to the real problem. You can waste so much time when you miss a step in your evidence checking.

#### What do I do?
If you spot this error in logic, you should establish whether the information at hand is evidence for the conclusion. Are there any other explanations for the evidence you're seeing? In our database example, there's so many different reasons a 500 error could occur, just because you can see the symptoms of something doesn't mean you know the cause. You need to find evidence up the chain to support your theory on the root cause of the problem - find more evidence until you're confident you can make a valid argument.

### Getting your booleans mixed up
![A figure with a confused expression, surrounded by question marks, trying to untangle a knot of negations.](/images/InvalidArgumentConfusion.png)
<br/>
Arguments get more complicated when you start to include negations. In the previous examples, the arguments are valid when your Ps or Qs are true. As with the best applications, sometimes you can put a ! in the wrong place and screw up the whole thing. 

| Argument | Form |
|----------|----------------|
| If you are an employed software engineer, then you have a job.<br/>You are not an employed software engineer.<br/>Therefore, you don’t have a job. | P → Q<br/>¬ P<br/>∴ ¬ Q |

Can you see the problem here? You’ve used one negation to prove another but they don’t follow each other! 

You can have a job and not be a software engineer, you cannot conclude the person doesn’t have a job based on the information in the argument. This is called denying the antecedent. It's best to compare it to a very similar form of valid argument called a *modus tollens*.

| Argument | Form |
|----------|----------------|
| If you are an employed software engineer, then you have a job.<br/>You don't have a job.<br/>Therefore, you're not an employed software engineer. | P → Q<br/>¬ Q<br/>∴ ¬ P |

This modus tollens argument is valid by making a valid inference, i.e. if P were true then Q would be true, since Q is false we can say P is also false. It sounds so obvious, but illogic can show up in a less obvious way. The thing to look out for is if you assume something isn’t true based on something else not being true, then you should check that assumption. Here's an example you might have come across:

| Argument | Form |
|----------|----------------|
| If the logs are saying there’s a problem with the thread pool, then there’s a problem in the thread pool.<br/>The logs aren’t saying there’s a problem with the thread pool.<br/>Therefore, there isn’t a problem in the thread pool. | P → Q<br/>¬ P<br/>∴ ¬ Q |

The problem here is much subtler. Although you don’t see logs saying there's a problem in the thread pool, it isn’t the only way you could detect a problem in the thread pool. Back in my early career I remember a problem in the thread pool affecting our logger, meaning the problem was causing the lack of logs! Just because you expect the behaviour doesn't mean something else isn't going on, you've made a leap of logic based on a negation that actually isn't valid! It happens, we're all human.
#### What do I do?
This is a common mistake, so be careful when you’re working with negations. If you find yourself making an argument that relies on a negation, check that the negation is in the right place and that you’re not making an inference based on something not being true. If you find yourself saying ‘there’s no evidence for X, therefore X isn’t true’ then you should check that there isn’t other evidence for X that you haven’t found yet. Just because you haven’t found evidence for something doesn’t mean it’s not true, it just means you haven’t found it yet.

## Debugging Arguments
There’s a plethora of errors to make; let’s go through some other common fallacies you could come across that are less *formal*. These are usually used as tactics (deliberately or unconsciously) that people can use to convince others when their arguments are bad. They're not necessarily invalid arguments, but...

### Fallacy fallacy
![A figure pointing out a logical fallacy, while the conclusion is actually correct.](/images/InvalidArgumentFallacyFallacy.png)
<br/>
Be careful; just because somebody commits an error in logic doesn’t mean their conclusion is false.

| Argument | Form |
|----------|----------------|
| If we developed feature X, then our customers would be happy.<br/>We haven’t developed feature X.<br/>Therefore, our customers aren’t happy. | P → Q<br/>¬ P<br/>∴ ¬ Q |

Aha! Invalid argument! The person has denied their antecedent! But wait... does that mean that their conclusion is false?

Unfortunately, if you pointed out that this person has erred, it doesn’t mean their customers are happy. The conclusion, although arrived at with an error in logic, could actually be quite true. Logic doesn't tell you if a premise or a conclusion is true, it tells you if an argument is valid or not.

#### What do I do?
Be humble and assess statements on their truth independently.
Just because you're a smarty-pants and you know what a bad argument looks like doesn't mean what the person is saying is false. Even if they arrive at a conclusion in an illogical way, what they're saying could be true. Take the conclusion as something that needs to be independently verified as much as the premises that someone makes; just because someone argues badly doesn't mean they're wrong. Being right in the wrong way is something that some people excel at.

### Authority
![A figure standing on a pedestal labeled 'Authority', trying to convince others with their elevated status.](/images/InvalidArgumentAuthority.png)

<br/>

If someone argues a point and to justify it they use their title, status or perceived respect on the team then beware! They may be leading you to make a fallacy called an appeal to authority. Similarly, if someone believes something because someone more experienced said it (without verifying it) then they might be falling into the same trap. 

Everyone is fallible, thinking you’re right doesn’t make you right and using your authority or the authority of someone else doesn’t make you right either.

Here's some examples which are far too common:
- We need to change the application to be more RESTful because Jenny said so and she's the architect.
- We need to use microservices because that's what my favourite tech influencer said in their latest blog post.
- I don't need to review this code because it's written by a senior developer and they know what they're doing.
- There aren’t any bugs in the thread pool because it was written by the CTO.

You get the point - it's essentially saying something is true because some person said it, and their implicit argument is that whatever that person says is true.

#### Variation: Ad hominem
This is a variation of the appeal to authority, but instead of appealing to someone's authority, you're attacking their character or personal traits to discredit their argument. For example, if someone says "We shouldn't listen to John's argument about the database configuration because he's a terrible developer", that's an ad hominem attack. It doesn't address the argument itself, but instead attacks the person making the argument. This is a common tactic to dismiss someone's argument without actually engaging with it.

#### What do I do?
Get to evidence and facts rather than talking about people. One tactic is to ask questions for the person to clarify why they have come to that conclusion in the hopes that in having to explain themselves that they’ll have to admit they have made assumptions. Or you might just learn why that person is so respected and you can learn something new!
If someone doesn't have a good reason to believe something other than ‘well X said it and she’s a TA’ then you can ask how that TA came to know it. If you get to a point where a premise is ‘person X said so’ then you are in the realms of the argument from authority. You can ask ‘why did Jenny say so? Why does it need to do that?’.
My tactic when this all happens is to play the stupid card. I pretend I need it explained to me to force people to confront their assumptions, e.g. "Sorry, I'm not getting it; why are we doing it that way? What did TA see that made him think that?" and so on. Politely moving the conversation to the evidence and the facts takes the person out of it and foils the appeal to authority. Not easy when you're dealing with *egos* but it can be done with a bit of tact and kindness.

### Regression
![A figure looking at a graph with a spike, assuming their actions caused the spike to go down.](/images/InvalidArgumentRegression.png)

In this case we’re not talking about testing. The regression fallacy is when you assume that a return to normal after an abnormal event is caused by something you did, without any evidence to support that claim. It’s a common mistake to make when you’re trying to fix a problem and you see that the problem has gone away after you’ve done something. You might be tempted to say “I fixed it!” but without evidence that what you did actually fixed the problem, you can’t be sure.

Story time: You see a spike in CPU in your live application, you look at logs and see something being logged around a file import that’s running. You see an inefficiency around that code and you think it must be hogging resources. You hotfix release. You wait... and you don’t see that issue for a while. You conclude that you must have fixed the issue. Hoorah!

So what's the problem? You don’t know if you've done anything to address the actual problem! You’ve used your actions while an abnormal event happened to explain *why* it returned to normal. Those actions could have nothing to do with the change in CPU. Maybe, when you released the hotfix it restarted the application which released some resources and allowed the application to recover. Your hotfix did relieve the symptoms of the issue but didn't actually fix anything!

Fast forward two weeks... The application is showing spikes in CPU again, as we were looking into this new problem, we ordered a sandwich. When the sandwich arrived the CPU spikes went away, therefore we should conclude that ordering sandwiches fixes CPU spikes, correct?

Well, no, unfortunately we can’t draw that conclusion because sandwiches don't fix CPU spikes. It’s obvious when the thing we do is so obviously unrelated to the problem, but as mentioned before I have seen people do this out in the wild. People fix bugs that aren't there by falling for the regression fallacy!

#### What do I do?
Evidence is key here. I feel like a broken record at this point. Your evidence needs to be *related* to the thing you're trying to prove. More sources of information that are independently verifiable should be used together to support your claim on the root cause of an issue. There's nothing wrong with an educated guess, but you have to follow that up with evidence that your guess is correct!
One way to guard against this is to include a way of monitoring the problem as part of your fix, find a way to verify your assumptions with logs, measures or metrics. If you don't have the evidence yet, then how can you get it?

### False dilemmas
![A figure looking at two wrong options and ignoring the correct one.](/images/InvalidArgumentFalseDilemma.png)

Sometimes there are either-or situations, but sometimes that’s oversimplifying things. For example:
```
You either love Java or you hate Java.
You don't love Java.
Therefore, you hate Java.
```

Ah, Java, the marmite of programming languages. But what is the error?

This doesn’t take account of the people that might be indifferent to Java. Yes those people exist! There's even a support group.

<br/><br/>
There are more pernicious examples that can come up.

- The application is queuing. There must be a problem with either the threads in the application or the database.
- There’s a bug in the logic for working out prices, it’s either been introduced recently by a software change or has always been there.

The problem with these arguments is that they present the premises as having a false dilemma. If you accept the basis of these arguments, then the implied way to resolve the dilemma is to prove one or the other things to be false, and then the other option must be true. 

So if we looked into database locks and found none, given the setup above, we’d have to conclude that the problem is in the application threads. However, we were set up with a bad argument here, there could be a networking problem or long-running functions introduced to explain the queueing. Actually, there could be a myriad of reasons for the queueing, these two options have constrained our thinking and made us ignore other possibilities.

Same for the bug situation, bugs don’t always come from recent software changes; you could unearth a bug by changing the way you use the code or the application's configuration. 
<br/><br/>
Be careful of a false dilemma, it presents an either/or situation which simplifies things and hides other avenues of investigation. They are appealing but they can lead you down the wrong path if you accept the framing without questioning it.

#### What do I do?
When you see an either/or situation, ask yourself if there are other options that haven’t been considered. If you find yourself in a situation where you have to prove one thing to be false to conclude the other is true, then you should check if there are other options that could be true. Don’t let the framing of the argument limit your thinking and make you ignore other possibilities.

## I can't do right from doing wrong!
There are many ways to argue badly, and these are just a few examples. The key takeaway is to be aware of these pitfalls and to always strive for sound arguments. 
Remember, being a good software citizen means being kind and respectful, even when pointing out errors in logic. By focusing on evidence and facts rather than personal attacks or appeals to authority, we can have more productive and meaningful discussions about software and its development.
<br/><br/>
There. I'll get off the soapbox now. Who would have thought that being kind would be the conclusion. Ah well, just be nice and watch out for those fallacies!