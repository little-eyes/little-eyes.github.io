title: "Weekend Fun with Azure Machine Learning"
layout: post
tags:
- machine learning
- azure ml
- tool
category:
- technology
date: 2015/10/17
---

> Sharp tools make good work.

It's been for a while since I get to know [Azure Machine Learning][1] which I believe would be a powerful tool for us to create any machine learning experiment in cloud. The machine learning studio is one of the interesting features in the system, it standardizes and componentizes the way we do machine learning, then with the drag-and-drop we can do anything. With good integration of Python and R, make it very powerful to do any customized data manipulation or algorithms.

<!-- more -->

I heard [Department of Transportation][2] has some interesting data set like flight delays. So I download a month of data and want to train a predictive model that we will know if certain flight will be late for more than 15 minutes. To build such a model is very easy, and I found Azure Machine Learning already has this example ([here is link][3]). I take a screenshot that you can see it's pretty much about drag-and-drop. Most of the modules used in this experiment already exist in the machine learning studio library. So it actually very clear how the data flows and very easy to replace one model with another or run multiple model in parallel then boost them.

![Alt text](/images/studio.png)

Model evaluation is straigt-forward as well. Methods like ROC curve can be easily added. With an easy click you can run the experiment, which usually finish in a few minutes. I feel the scalability should be good as well, but I need to test more of this in the next blog which I am planning to explore the dataset fully and dig out some interesting insights in it.

![Alt text](/images/evaluation.png)

Another aspect of this is the cost because you could run all your experiment in your local machine. Then the question is why do we need such a thing. For dataset like we used in this blog, it is GB level. So it might still work well with your local machine with hours time waiting for results. But Azure's standard subscription only cost you $10 subscription fee and $1/hour experiment fee. All the experiments run across machines which reduces the experiment hours as well. Faster and cheaper is what I see from a cloud-based machine learning tool. I believe the same thing will go with AWS machine learning as well.

Next thing is deployment. If you want to deploy your experiment to production, cloud-based machine learning tool allows you to do so in a simple click. Then why not save a whole chunk of time struggling with machines, environments and configurations, and the worries of scalability?

Next blog I am going to analyze the data more thoroughly to see if there is anything interesting.

[1]: https://azure.microsoft.com/en-us/services/machine-learning/
[2]: http://transtats.bts.gov/DL_SelectFields.asp?Table_ID=236&DB_Short_Name=On-Time
[3]: http://gallery.cortanaanalytics.com/Experiment/837e2095ce784f1ba5ac623a60232027#azureml-experience-anchordisplayanchor-1
