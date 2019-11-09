---
id: component-antd-tagcloud
title: antd Tag Cloud
sidebar_label: antd Tag Cloud
---

This component utilizes antd's tag component.  You can find more information at [Ant Design](../react/lib_antdesign).

![1573276793050](..\assets\tagcloud-01.png)

The basic functionality will allow you to pass an array of objects containing tag information and function for turning on and off the tags.  These functions will most likely be saving the state of each tag in some fashion, maybe a redux store, react context and/or a JSON file or database.

## Tag Cloud Code

TagCloud.js

```jsx
import React from "react";
import PropTypes from "prop-types";
import { Tag } from "antd";

class TagCloud extends React.Component {
  static TagItem = ({
    tagName,
    isSelected,
    onDeSelectTag,
    onSelectTag,
    ...props
  }) => {
    return (
      <Tag.CheckableTag
        style={props.tagStyle ? props.tagStyle : { margin: "5px 2px" }}
        checked={isSelected}
        onChange={() => {
          isSelected ? onDeSelectTag() : onSelectTag();
        }}
      >
        {tagName}
      </Tag.CheckableTag>
    );
  };
  render() {
    return React.Children.map(this.props.children, child =>
      React.cloneElement(child, {
        ...this.props
      })
    );
  }
}

TagCloud.TagItem.propTypes = {
  tagName: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onDeSelectTag: PropTypes.func.isRequired,
  onSelectTag: PropTypes.func.isRequired
};

export default TagCloud;
```

## How to Use the TagCloud

You will invoke the TagCloud component with n number of TagCloud.TagItem components.  The TagItem components will need the following:

- key - unique key for each tag
- tagName - the tag name to display
- isSelected - a boolean determining if the tag is "selected"/"on" or not
- onSelectTag - a function that will run when a tag is selected
- onDeSelectTag - a function that will run when a tag is deselected.

Below is an example implementation.

```jsx
import React from "react";

import TagCloud from "./TagCloud";

let basetags = [
  {
    tagKey: 1,
    tagName: "Tag1",
    isMember: true
  },
  {
    tagKey: 2,
    tagName: "Tag2",
    isMember: true
  },
  {
    tagKey: 3,
    tagName: "Tag3",
    isMember: false
  },
  {
    tagKey: 4,
    tagName: "Tag4",
    isMember: false
  },
  {
    tagKey: 5,
    tagName: "Tag5",
    isMember: true
  }
];

const QuickTagItem = props => {
  //let { show, tagShowData, setMemberFlag } = props;
  let [tags, setTags] = React.useState(basetags);
  const setMemberFlag = (tagKey, memberFlag) => {
    let newTags = Array.from(tags);
    newTags = newTags.map(tag => {
      if (tag.tagKey === tagKey) {
        tag.isMember = memberFlag;
      }
      return tag;
    });
    setTags(newTags);
  };

  return (
    <div>
      <div>
        <div>Tags</div>
        <div>
          <TagCloud tagStyle={{ margin: "5px 2px" }}>
            {tags.map(tag => {
              return (
                <TagCloud.TagItem
                  key={tag.tagKey}
                  tagName={tag.tagName}
                  isSelected={tag.isMember}
                  onSelectTag={() => setMemberFlag(tag.tagKey, true)}
                  onDeSelectTag={() => setMemberFlag(tag.tagKey, false)}
                />
              );
            })}
          </TagCloud>
        </div>
      </div>
    </div>
  );
};

export default QuickTagItem;
```

