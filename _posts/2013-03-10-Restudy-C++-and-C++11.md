---
title: "Restudy C++ and C++11"
layout: post
tags: programming, c++
---

> Oh! C++ ... Yes! C++ ...

The major reason that I switched to Python from C++ is the complexity of C++ at that time. I thought writing large program using C++ was a disaster: it took too much effort in coding. Instead, if I use Python, I could save tons of lines. However, when I re-read the _C++ Primer_ again today, I know C++ is not as bad as I thought. Especially for C++11.

## Programming Styles

Before I start talking about C++11, I would like to tell something about our C++ programming style. Frankly speaking, I am a dis-organized programmer when writing a large project. Usually, I do not take care of header files very much in the small project, but now I think the structure of the whole project is **very** important for us. Now I am improving myself. For how to organize the your project, I recommend you to read C++ Primer for details. In general, you can put the following (and ONLY) into the headers:

* Function prototypes
* Symbolic constants defined using `#define` or `const`
* Structure declarations
* Class declarations
* Template declarations
* Inline functions

## C++11

As for C++11, the first feature I like is the `tuple` type. In Python, it is extremely easy to make a tuple and use it as the return value from a function. However, the previous C++ can drive you crazy if you want to return more than one piece of data, even you can make an object of your return type. Fortunately, C++11 introduces such a wonderful feature. If you like to know more about it, check out this [reference][1].

Then, C++11 surprisingly supports `type inference` via `auto` keyword. Just like Python, you do not need to worry about the exact type of the object, the compiler can help you figure it out. But I do not know the exact way in C++11 to derive the type (maybe a semantic approach). The coin still brings a bad edge: obscure programming. If you use _auto_ keyword, it may be hard for others to infer what you really want to write here. I guess that's why [Google C++ Style Standards][2] does NOT recommend us to use it. Personally, it is a good stuff to write your program easy and flexible.

For containers, C++11 adds `unordered` for set, multiset, map and multimap. In addition, `array` seems to be very interesting, it provides an interface for C-like array but encapsulated. Comparing to vector in C++, I guess it improves the performance a lot, yet I have not measured it. Further, iterators add the `lambda function` support. I pretty much like this feature because I hate write for loops by myself. This feature makes C++ much simpler and more concise just like Python's way.

Finally, the `threading`. Although it is always a significant component, thread library has not be in C++ standard until this modern one, yet we use `pthread` for a while. Now you can write multi-threading code as you want, whichever the compiler is. It's just the standard! Besides threading, the regular expression can also be interesting and important to C++ programmer.

Since C++11 brings so much new features in and achieves an excellent performance which has a large margin comparing to other programming languages ([the literature from Google Research][3]). From both performance and simplicity's viewpoints, I would recommend to use C++11. But I am not saying to replace something, because languages like Python has it's perfect power to do web service, natural language process, etc. A hybrid language environment is very common nowadays, but we just need to be careful about the right language for the specific work.

> P.S.
> Check out this [Video][4] from Bjarne Stroustrup.

[1]: http://en.cppreference.com/w/cpp/utility/tuple
[2]: http://google-styleguide.googlecode.com/svn/trunk/cppguide.xml
[3]: http://research.google.com/pubs/pub37122.html
[4]: http://channel9.msdn.com/Events/GoingNative/GoingNative-2012/Keynote-Bjarne-Stroustrup-Cpp11-Style?goback=%2Egde_2771729_member_93354359
