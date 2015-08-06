'use strict';

module.exports = (function () {
	var self = {
		count: 0,
		edges: {},
		nodes: {}
	};

	self.link = function (source, target, weight) {
		weight = weight || 1;

		if (self.nodes.hasOwnProperty(source) !== true) {
			self.count++;
			self.nodes[source] = {
				weight: 0,
				outbound: 0
			};
		}

		self.nodes[source].outbound += weight;

		if (self.nodes.hasOwnProperty(target) !== true) {
			self.count++;
			self.nodes[target] = {
				weight: 0,
				outbound: 0
			};
		}

		if (self.edges.hasOwnProperty(source) !== true) {
			self.edges[source] = {};
		}

		if (self.edges[source].hasOwnProperty(target) !== true) {
			self.edges[source][target] = 0;
		}

		self.edges[source][target] += weight;
	};

	self.rank = function (alpha, epsilon, callback) {
		var delta = 1,
			inverse = 1 / self.count;

		for (var source in self.edges) {
			if (self.edges.hasOwnProperty(source) === true) {
				if (self.nodes[source].outbound > 0) {
					for (var target in self.edges[source]) {
						if (self.edges[source].hasOwnProperty(target) === true) {
							self.edges[source][target] /= self.nodes[source].outbound;
						}
					}
				}
			}
		}

		for (var key in self.nodes) {
			if (self.nodes.hasOwnProperty(key) === true) {
				self.nodes[key].weight = inverse;
			}
		}

		while (delta > epsilon) {
			var leak = 0,
				nodes = {};

			for (var key in self.nodes) {
				if (self.nodes.hasOwnProperty(key) === true) {
					nodes[key] = self.nodes[key].weight;

					if (self.nodes[key].outbound === 0) {
						leak += self.nodes[key].weight;
					}

					self.nodes[key].weight = 0;
				}
			}

			leak *= alpha;

			for (var source in self.nodes) {
				if (self.nodes.hasOwnProperty(source) === true) {
					for (var target in self.edges[source]) {
						if (self.edges[source].hasOwnProperty(target) === true) {
							self.nodes[target].weight += alpha * nodes[source] * self.edges[source][target];
						}
					}

					self.nodes[source].weight += (1 - alpha) * inverse + leak * inverse;
				}
			}

			delta = 0;

			for (var key in self.nodes) {
				if (self.nodes.hasOwnProperty(key) === true) {
					delta += Math.abs(self.nodes[key].weight - nodes[key]);
				}
			}
		}

		for (var key in self.nodes) {
			if (self.nodes.hasOwnProperty(key) === true) {
				if (callback(key, self.nodes[key].weight) === false) {
					break;
				}
			}
		}
	};

	self.reset = function () {
		self.edges = {};
		self.nodes = {};
	};

	return self;
})();
