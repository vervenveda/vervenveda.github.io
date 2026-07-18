# theverifier.github.io


# Complete CommonMark & GitHub Markdown Test
# Markdown Syntax Cheat Sheet
*A complete guide showing what to type and what it renders as.*

---

# Headings

## Syntax

```md
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6
```

## Output

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

---

# Paragraphs

## Syntax

```md
This is paragraph one.

This is paragraph two.

This is still
the same paragraph.

This line ends with two spaces.··
Next line
```

(The `··` represents **two spaces** before pressing Enter.)

## Output

This is paragraph one.

This is paragraph two.

This is still
the same paragraph.

This line ends with two spaces.  
Next line

---

# Bold

## Syntax

```md
**Bold Text**

__Bold Text__
```

## Output

**Bold Text**

__Bold Text__

---

# Italic

## Syntax

```md
*Italic Text*

_Italic Text_
```

## Output

*Italic Text*

_Italic Text_

---

# Bold + Italic

## Syntax

```md
***Bold Italic***

___Bold Italic___
```

## Output

***Bold Italic***

___Bold Italic___

---

# Strikethrough

## Syntax

```md
~~Deleted Text~~
```

## Output

~~Deleted Text~~

---

# Mixed Formatting

## Syntax

```md
**Bold with _Italic_ inside**

*Italic with **Bold** inside*

~~**Bold Strikethrough**~~
```

## Output

**Bold with _Italic_ inside**

*Italic with **Bold** inside*

~~**Bold Strikethrough**~~

---

# Horizontal Rules

## Syntax

```md
---

***

___
```

## Output

---

***

___

---

# Blockquotes

## Syntax

```md
> Quote

> Multi-line
> Quote

>> Nested Quote

>>> Triple Nested
```

## Output

> Quote

> Multi-line
> Quote

>> Nested Quote

>>> Triple Nested

---

# Lists

## Unordered List

### Syntax

```md
- Apple
- Banana
- Cherry
```

### Output

- Apple
- Banana
- Cherry

---

### Syntax

```md
* Apple
* Banana
* Cherry
```

### Output

* Apple
* Banana
* Cherry

---

### Syntax

```md
+ Apple
+ Banana
+ Cherry
```

### Output

+ Apple
+ Banana
+ Cherry

---

# Nested Lists

## Syntax

```md
- Parent
    - Child
        - Grandchild
```

## Output

- Parent
    - Child
        - Grandchild

---

# Ordered Lists

## Syntax

```md
1. First
2. Second
3. Third
```

## Output

1. First
2. Second
3. Third

---

# Mixed Lists

## Syntax

```md
1. Item
    - Child
        1. Grandchild
```

## Output

1. Item
    - Child
        1. Grandchild

---

# Links

## Inline Link

### Syntax

```md
[GitHub](https://github.com)
```

### Output

[GitHub](https://github.com)

---

## Automatic Link

### Syntax

```md
<https://github.com>
```

### Output

<https://github.com>

---

## Email Link

### Syntax

```md
<example@example.com>
```

### Output

<example@example.com>

---

## Reference Link

### Syntax

```md
[GitHub][github]

[github]: https://github.com
```

### Output

[GitHub][github]

[github]: https://github.com

---

# Images

## Basic Image

### Syntax

```md
![Alt Text](https://via.placeholder.com/200)
```

### Output

![Alt Text](https://via.placeholder.com/200)

---

## Clickable Image

### Syntax

```md
[![Alt](https://via.placeholder.com/150)](https://github.com)
```

### Output

[![Alt](https://via.placeholder.com/150)](https://github.com)

---

# Inline Code

## Syntax

```md
Use the `git status` command.
```

## Output

Use the `git status` command.

---

# Code Blocks

## Plain

### Syntax

````md
```
Hello World
```
