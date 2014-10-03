---
title: "Some Tips to Make Your Code Looks Professional"
layout: post
tags: job, software engineer
category: technology
---

A few months ago, I was preparing my internship interview for some companies. With my friend's help, I improved a lot before I started my interview. Then I spent a whole summer writting program and integrating into a large code base. After the internship process, I have some feelings about my previous bad (or school-like) coding style and I hope my experience in this article can help you improve yourself.

So here is the first deal: **Variable Names**. I was exteremely bad at giving variable names, and I owe this to my ACM-ICPC experience where the code I wrote is only readable for me and my teammates (because they write the same style of code). We like to use a single character to represent a variable. For instance, look at the following block of code.

	...
    for (int i = 0; i <　n; i++)
    {
    	p += gcd(a[i], q);
    }
    ...

Frankly speaking, I know what I am trying to do, but do you know? Look, all the variables are single character which confuses not only your teammates but yourself some time as well. So, if you are not in a hurry, why not give a meaningful name for variables, functions or classes? Perhaps, we can rewrite the above code block in this way.

    ...
    for (int index = 0; index < NumberOfData; index++)
    {
    	value += GreatestCommonDivider(Data[index], baseNumber);
    }
    ...

Next, I would say **Error Checking**. Seriously, I am not a big fan to do the error checking. However, my internship completely change this bad habits. My code review results' No. 1 comment is always error checking! 

* Have you considered bad input? 
* Have you checked the pointer? 
* Have you catched excpetions?
* What if this line failed? What will you do?
* What if there is no more memory to allocate?
* Will you continue execute if this line has exceptions?
* ...

Really? I would ask why there are so many things to consider, which at least double the lines of my code. I hate the feelings, I hate to write a long code... However, I think I forgot the horrible time in debug, when I cannot find the bug but the program keep crashing. In contrast, if you take care of the above program, you will save tons of debugging time. At least, my experience prove this to be true! I usually spent 50% more time in writing the code and handling different types of error, and if a bug appears, I can catch it within 5 minutes. What a great improvement? Anyone who reads your code wants your code be this way! 

So, the question _how_? Well, I think the first step you should consider is the have a systematic error code. For example, in Windows COM program, **HRESULT** is a typical and standard error code. Now, look at the following code.

	...
	void function1 (int parameter)
	{
		// doing something here ...
	}

	string function2 (int parameter)
	{
		// doing something here ...
		return results;
	}

If we think carefully, we can easily find that there is no way to tell whether the two functions are success or failed. So when you call these two functions, and they failed, you could spend an hour to figure our this line via a step-by-step watch. However, if you change the way to the following code, things will be easier.

	...
	HRESULT function1 (int parameter)
	{
		// doing something here ...
		return S_OK;
	}

	HRESULT function2 (int parameter, string &results)
	{
		// doing something here ...
		results = someString;
		return S_OK;
	}

When you call these functions, you can check the return code and reflect the error message. Look at the following code block.

	...
	if (function1(parameter) != S_OK)
	{
		cout << "error calling function1" << endl;
	}

	if (function2(parameter, results) != S_OK)
	{
		cout << "error calling function2" << endl;
	}

Now you can use this approach to build a hierarchical error code checking system in your program. Along the error code, we have to prepare for the cornor-case parameters of a function. As an example, the following code block shows the possibility of an NULL pointer. Then we have to use error code to capture this error.

	...
	HRESULT function (DataStore *dataStore)
	{
		if (dataStore == NULL)
		{
			return E_POINTER;
		}
		...
	}
	...

As one of my friend said, "every function will fail!" So for the places it may fail, we need to handle it, right?

Alternatively, you can use exceptions. Previously, 99% of my code do not catch any exceptions only if I was required to do so. Although not all modules or libs have exception support, but they are definitely useful. For instance, the following code piece shows the exceptions and STL.

	...
	vector <int> data;
	try
	{
		data.push_back(1);
		data.push_back(2);
	}
	catch (std::bad_alloc &e)
	{
		cout << e.what() << endl;
		throw e;
	}
	...

In addition, pointer is always an interesting topic and its memory leaking problem usually brings big troubles. Many school projects are small and the memory leaks are not severe so that few of us would spend the time to cleanup everything before the program ends. So if you add memory clear up into your code, this not only makes your code look professional but more reliable as well. For examples, consider the following code block.

	...
	char *buffer = new char[30];
	...
	delete []buffer;

	...
	char *buffer = (char *) malloc(sizeof(char) * 30);
	...
	free(buffer);

More interestingly, if you look at the above code, you can find the numbers like 30. It is OK to use fix number in your code, but it is more proper to use a variable or macro to replace the fix number in the code. Look at the following code piece.

	...
	#define BUFFER_SIZE 30
	const int BUFFER_LENGTH = 30;
	...
	char *buffer = new char[BUFFER_SIZE];
	char *buffer2 = (char *) malloc(sizeof(char) * BUFFER_LENGTH);
	...

Finally, using object-oriented design and a proper source file structure will be more efficient. Many of our course project in school will not use object oriented design so that we just keep repeating copy-and-paste tons of code within a single file. This makes your code look ugly and terrible, and you will forget the meaning of your code at your maximum speed. Therefore, why not spend some time to group your designs into classes, give a explicit name, and use the class instances.
