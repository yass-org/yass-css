
# Yass CSS

Atomic CSS that uses your design system.

## Overview

Yass uses your design tokens to create an Atomic CSS library. There's a lot in that sentence, so let's spend some time answering common questions you might have.

### Quickstart

1. Generate a stylesheet
    ```bash
    $ npx yass-css # With no tokens specified, YASS will use it's default tokens
    ```
2. Reference it in your HTML
   ```html
    <link rel="styles/yass.css" /> 
   ```
3. Start writing YASS:
   ```html
    <div class="
      padding:10
      background-color:green-500
    ">
   ```

### How does Yass know what my design tokens are? 

### What is the Atomic CSS that gets created?

### What are the benefits of all this?

- **Easy to learn**: Learning other atomic CSS libraries usually involves constantly looking up classnames for valid classnames so you can find out that `bg-yellow-100` is valid, but `bg-color-yellow-100` is not. Yass atomic classes correspond directly to their associated CSS property. Therefore, if you know CSS, and you know your design system, then you have already learned Yass.
- **Enforces design token usage**: It's useful to think of Yass as: "The subset of CSS that conforms to your design system." For example, for the tokens defined above:
  ```html
    <div
      class='
        background-color:red-50   // ✅ Works
        background-color:red-100  // ✅ Works
        background-color:red-51   // ❌ Does not work
        background-color:#FF0000  // ❌ Does not work
      '    
    >
    </div>
  ```
- **Easily statically analyzable escape hatches:** As your codebase scales, it is reasonable to expect that there will be designs your design system isn't able to represent. This is normal, but it's valuable to be able to:
  1. Know when this has happened.
  2. Reason about why it's happened.

  With Yass, all styles are defined in `yass.css` (or whatever you decide to call it in your `yass.config`). Any CSS, SCSS, etc that is defined anywhere else indicate styles that have probably diverged from your design system. Collating and analyzing these can provide useful insights about how much of your codebase conforms to your design system, and possible new tokens that should be included. 

## Installation

## Configuration

## Development
