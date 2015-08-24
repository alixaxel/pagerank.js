pagerank.js
-----------

Vanilla JavaScript implementation of the Weighted PageRank Algorithm

Usage
-----

```js
var graph = require('pagerank.js');

graph.link(1, 2, 1.0)
graph.link(1, 3, 2.0)
graph.link(2, 3, 3.0)
graph.link(2, 4, 4.0)
graph.link(3, 1, 5.0)

graph.rank(0.85, 0.000001, function (node, rank) {
    console.log("Node " + node + " has a rank of " + rank)
})
```

Install
-------

	npm install pagerank.js

License
-------

MIT