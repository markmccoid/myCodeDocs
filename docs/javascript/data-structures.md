---
id: data-structures
title: Data Structures
sidebar_label: Data Structures
---

## Queues

```javascript
const queue = () => {
  let q = [];
  return {
    enqueue(item) {
      q.unshift(item);
    },
    dequeue() {
      return q.pop()
    },
    peek() {
      return queue[queue.length - 1]
    },
    get length() {
      return queue.length
    },
    isEmpty() {
      return queue.length === 0
    },
    showQ() {
      console.log(q)
    }
  }
  }


let myQue = queue();
console.log(myQue.isEmpty())
myQue.enqueue('Test1')
myQue.enqueue('Test2')
myQue.showQ();
console.log(myQue.dequeue());
myQue.showQ()
```



## Linked List

Note that the pop function not working??

```javascript
   function createNode(value) {
  return {
    value,
    next: null
  }
};

function createLinkedList() {
  return {
    head: null,
    tail: null,
    length: 0,
      
    push(value) {
      const node = createNode(value);
      console.log(node)
      if (this.head === null) {
        this.head = node
        this.tail = node
        this.length++
        return node
      }
      // this is the previous item (the old tail) now pointing to the new tail
      this.tail.next = node;
      // set the new tail
      this.tail = node;
      this.length++
    },
    pop() {
      if (this.isEmpty()) {
        return null
      }
      
      const node = this.tail
      
      // If only one item (head and tail equal) reset head and tail, return saved tail node
      if (this.head === this.tail) {
        this.head = null
        this.tail = null
        this.length--
        return node
      }
      // If more than one node, walk through until we find the tail in the next property
      let current = this.head
      let penultimate
      while (current) {
        if (current.next = this.tail) {
           penultimate = current;
           break;
        }
        current = current.next
      }
      // We have found the new tail, set its next to null return the old tail
      penultimate.next = null;
      this.tail = penultimate;
      this.length--;
      
      return node;
    },
    get(index) {
      // Bad index passed, return null
      if (index < 0 || index > this.length) {
        return null
      }
      // return head as it is always the zero index
      if (index === 0) {
        return this.head
      }
      let current = this.head;
      let i = 0;
      while (i < index) {
        i++;
        current = current.next;
      }
      return current;
    },
    delete(index) {
      if (index < 0 || index > this.length) {
        return null
      }

      if (index === 0) {
        const deleted = this.head

        this.head = this.head.next
        this.length--

        return deleted
      }
      
      let current = this.head
      let previous
      let i = 0

      while (i < index) {
        i++
        previous = current
        current = current.next
      }

      const deleted = current
      previous.next = current.next
      this.length--

      return deleted
  },
    print() {
      const values = []
      let current = this.head

      while (current) {
        values.push(current.value)
        current = current.next
      }

      return values.join(' => ')
   },
    isEmpty() {
      return this.length === 0;
    }
  }
}
let llist = createLinkedList();

llist.push('test')
llist.push('test2')
llist.push('test4')
console.log(llist.print())
console.log(llist.delete(1))
console.log(llist.print())
console.log(llist.isEmpty())
```

