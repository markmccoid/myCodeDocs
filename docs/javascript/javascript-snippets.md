---
id: javascript-snippets
title: Javascript Snippets
sidebar_label: Javascript Snippets
---



## String / Unicode Normalization

[String Normalization Article](https://withblue.ink/2019/03/11/why-you-need-to-normalize-unicode-strings.html?utm_medium=email&utm_source=topic+optin&utm_campaign=awareness&utm_content=20190316+programming+nl&mkt_tok=eyJpIjoiWW1abE9HTXlaR1V6TVdNeiIsInQiOiI4em9qVHNHK1pOTFFtSDNsXC8xbjJrU1hGTWdQclFGNFUwSVVlV0c4SXJ2U3Fja3hSSk1ERlpBQnAzNytuck5abGNUc0VLVmp0OFJYNnEyT3NFU0M3cEduMDhvdVNqZ1BiZHZrQ0k0VUVRMHJWdUliSlE1Q0k3Zit0ajlObDRBdU4ifQ%3D%3D)

When doing a string comparison, if you are comparing Unicode characters, you may get incorrect results because of the fact that Unicode can be defined in UTF-8 or UTF-16.

To safely do this, you need to normalize the strings.  Luckily, there is a JavaScript function on the string prototype for this.

```javascript
const str = '\u0065\u0301'
console.log(str == '\u00e9') // => false
const normalized = str.normalize('NFC')
console.log(normalized == '\u00e9') // => true
console.log(normalized.length) // => 1
```

