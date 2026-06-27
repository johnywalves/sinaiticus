---
title: Decorators in Python
layout: base.njk
category: Snippets
tags: [python]
---

A **decorator** is a function that takes another function and extends its
behavior without modifying it directly. They rely on [[closures]] to keep a
reference to the original function.

```python
import functools

def log(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        print(f"calling {func.__name__}")
        return func(*args, **kwargs)
    return wrapper

@log
def soma(a, b):
    return a + b
```

`functools.wraps` preserves the name and docstring of the decorated function.

See also: [[closures]].
