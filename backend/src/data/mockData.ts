import {
  Question,
  Interview,
  AssessmentAttempt,
  Scorecard,
  UserProfile,
  AuditLogEntry,
  ApiKey,
  WebhookEndpoint,
} from '../types';

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: 'q-101',
    title: 'LRU Cache Implementation',
    difficulty: 'Medium',
    category: 'Data Structures',
    version: 'sha256:d89e1a',
    timeLimitSec: 2,
    memoryLimitMB: 256,
    author: 'Platform Curated',
    description: `Design a data structure that follows the constraints of a **Least Recently Used (LRU) cache**.

Implement the \`LRUCache\` class:
- \`LRUCache(int capacity)\`: Initialize the LRU cache with positive size \`capacity\`.
- \`int get(int key)\`: Return the value of the \`key\` if the key exists, otherwise return \`-1\`.
- \`void put(int key, int value)\`: Update the value of the \`key\` if the \`key\` exists. Otherwise, add the \`key-value\` pair to the cache. If the number of keys exceeds the \`capacity\` from this operation, evict the least recently used key.

The functions \`get\` and \`put\` must each run in \`O(1)\` average time complexity.`,
    constraints: [
      '1 <= capacity <= 3000',
      '0 <= key <= 10^4',
      '0 <= value <= 10^5',
      'At most 2 * 10^5 calls will be made to get and put.'
    ],
    examples: [
      {
        input: '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]',
        output: '[null, null, null, 1, null, -1, null, -1, 3, 4]',
        explanation: 'LRUCache lRUCache = new LRUCache(2);\nlRUCache.put(1, 1);\nlRUCache.put(2, 2);\nlRUCache.get(1);    // returns 1\nlRUCache.put(3, 3); // LRU key was 2, evicts key 2\nlRUCache.get(2);    // returns -1 (not found)\nlRUCache.put(4, 4); // LRU key was 1, evicts key 1\nlRUCache.get(1);    // returns -1 (not found)\nlRUCache.get(3);    // returns 3\nlRUCache.get(4);    // returns 4'
      }
    ],
    starterCode: {
      javascript: `class LRUCache {
  /**
   * @param {number} capacity
   */
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  /** 
   * @param {number} key
   * @return {number}
   */
  get(key) {
    if (!this.cache.has(key)) return -1;
    const val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }

  /** 
   * @param {number} key 
   * @param {number} value
   * @return {void}
   */
  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    this.cache.set(key, value);
  }
}

// Interactive execution runner helper
function runTests() {
  const cache = new LRUCache(2);
  cache.put(1, 1);
  cache.put(2, 2);
  console.log("get(1) =>", cache.get(1));
  cache.put(3, 3);
  console.log("get(2) =>", cache.get(2)); // expected -1
  return "All sample runs executed";
}

runTests();`,
      typescript: `class LRUCache {
  private capacity: number;
  private map: Map<number, number>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.map = new Map();
  }

  get(key: number): number {
    if (!this.map.has(key)) return -1;
    const value = this.map.get(key)!;
    this.map.delete(key);
    this.map.set(key, value);
    return value;
  }

  put(key: number, value: number): void {
    if (this.map.has(key)) {
      this.map.delete(key);
    } else if (this.map.size >= this.capacity) {
      const firstKey = this.map.keys().next().value;
      if (firstKey !== undefined) this.map.delete(firstKey);
    }
    this.map.set(key, value);
  }
}

const lru = new LRUCache(2);
lru.put(1, 1);
lru.put(2, 2);
console.log("Cache get 1:", lru.get(1));`,
      python: `class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = {}

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        # Move to end to mark as recently used
        val = self.cache.pop(key)
        self.cache[key] = val
        return val

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.cache.pop(key)
        elif len(self.cache) >= self.capacity:
            # Evict first item (least recently used)
            first_key = next(iter(self.cache))
            del self.cache[first_key]
        self.cache[key] = value

# Self-contained verification
cache = LRUCache(2)
cache.put(1, 1)
cache.put(2, 2)
print("get(1):", cache.get(1))
cache.put(3, 3)
print("get(2):", cache.get(2))
`,
      java: `import java.util.LinkedHashMap;
import java.util.Map;

class LRUCache {
    private final int capacity;
    private final LinkedHashMap<Integer, Integer> map;

    public LRUCache(int capacity) {
        this.capacity = capacity;
        this.map = new LinkedHashMap<>(capacity, 0.75f, true) {
            @Override
            protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {
                return size() > LRUCache.this.capacity;
            }
        };
    }

    public int get(int key) {
        return map.getOrDefault(key, -1);
    }

    public void put(int key, int value) {
        map.put(key, value);
    }
}`,
      cpp: `#include <unordered_map>
#include <list>
using namespace std;

class LRUCache {
    int cap;
    list<pair<int, int>> lruList;
    unordered_map<int, list<pair<int, int>>::iterator> cache;
public:
    LRUCache(int capacity) : cap(capacity) {}
    
    int get(int key) {
        auto it = cache.find(key);
        if (it == cache.end()) return -1;
        lruList.splice(lruList.begin(), lruList, it->second);
        return it->second->second;
    }
    
    void put(int key, int value) {
        auto it = cache.find(key);
        if (it != cache.end()) {
            lruList.splice(lruList.begin(), lruList, it->second);
            it->second->second = value;
            return;
        }
        if (cache.size() >= cap) {
            cache.erase(lruList.back().first);
            lruList.pop_back();
        }
        lruList.emplace_front(key, value);
        cache[key] = lruList.begin();
    }
};`,
      go: `package main

import "fmt"

type LRUCache struct {
    capacity int
}

func Constructor(capacity int) LRUCache {
    return LRUCache{capacity: capacity}
}

func (this *LRUCache) Get(key int) int {
    return -1
}

func (this *LRUCache) Put(key int, value int) {
}

func main() {
    fmt.Println("LRU Cache Initialized")
}`,
      csharp: `using System;
using System.Collections.Generic;

public class LRUCache {
    private int capacity;
    
    public LRUCache(int capacity) {
        this.capacity = capacity;
    }
    
    public int Get(int key) {
        return -1;
    }
    
    public void Put(int key, int value) {
    }
}`
    },
    referenceCode: {
      javascript: `class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.cache = new Map();\n  }\n  get(key) {\n    if (!this.cache.has(key)) return -1;\n    const val = this.cache.get(key);\n    this.cache.delete(key);\n    this.cache.set(key, val);\n    return val;\n  }\n  put(key, value) {\n    if (this.cache.has(key)) {\n      this.cache.delete(key);\n    } else if (this.cache.size >= this.capacity) {\n      this.cache.delete(this.cache.keys().next().value);\n    }\n    this.cache.set(key, value);\n  }\n}`,
      typescript: `class LRUCache {\n  private capacity: number;\n  private map: Map<number, number>;\n  constructor(capacity: number) {\n    this.capacity = capacity;\n    this.map = new Map();\n  }\n  get(key: number): number {\n    if (!this.map.has(key)) return -1;\n    const value = this.map.get(key)!;\n    this.map.delete(key);\n    this.map.set(key, value);\n    return value;\n  }\n  put(key: number, value: number): void {\n    if (this.map.has(key)) {\n      this.map.delete(key);\n    } else if (this.map.size >= this.capacity) {\n      this.map.delete(this.map.keys().next().value!);\n    }\n    this.map.set(key, value);\n  }\n}`,
      python: `class LRUCache:\n    def __init__(self, capacity):\n        self.capacity = capacity\n        self.cache = {}\n    def get(self, key):\n        if key not in self.cache:\n            return -1\n        val = self.cache.pop(key)\n        self.cache[key] = val\n        return val\n    def put(self, key, value):\n        if key in self.cache:\n            self.cache.pop(key)\n        elif len(self.cache) >= self.capacity:\n            del self.cache[next(iter(self.cache))]\n        self.cache[key] = value`,
      java: `import java.util.LinkedHashMap;\nimport java.util.Map;\nclass LRUCache {\n    private final int capacity;\n    private final LinkedHashMap<Integer, Integer> map;\n    public LRUCache(int capacity) {\n        this.capacity = capacity;\n        this.map = new LinkedHashMap<>(capacity, 0.75f, true) {\n            protected boolean removeEldestEntry(Map.Entry<Integer, Integer> e) { return size() > LRUCache.this.capacity; }\n        };\n    }\n    public int get(int key) { return map.getOrDefault(key, -1); }\n    public void put(int key, int value) { map.put(key, value); }\n}`,
      cpp: `#include <unordered_map>\n#include <list>\nusing namespace std;\nclass LRUCache {\n    int cap;\n    list<pair<int,int>> lru;\n    unordered_map<int, list<pair<int,int>>::iterator> cache;\npublic:\n    LRUCache(int capacity) : cap(capacity) {}\n    int get(int key) {\n        auto it = cache.find(key);\n        if (it == cache.end()) return -1;\n        lru.splice(lru.begin(), lru, it->second);\n        return it->second->second;\n    }\n    void put(int key, int value) {\n        if (cache.count(key)) { lru.splice(lru.begin(), lru, cache[key]); cache[key]->second = value; return; }\n        if ((int)cache.size() >= cap) { cache.erase(lru.back().first); lru.pop_back(); }\n        lru.emplace_front(key, value);\n        cache[key] = lru.begin();\n    }\n};`,
      go: `package main\nfunc main() {}`,
      csharp: `public class LRUCache {\n    private int capacity;\n    public LRUCache(int capacity) { this.capacity = capacity; }\n    public int Get(int key) { return -1; }\n    public void Put(int key, int value) {}\n}`,
    },
    tags: ['algorithms', 'cache'],
    usageCount: 3,
    published: true,
    testCases: [
      {
        id: 'tc-1',
        name: 'Basic Put & Get with Capacity 2',
        input: 'put(1,1), put(2,2), get(1), put(3,3), get(2)',
        expectedOutput: '[1, -1]',
        isHidden: false,
        explanation: 'Capacity is 2, key 2 is evicted when key 3 is added.'
      },
      {
        id: 'tc-2',
        name: 'Overwrite Existing Key Value',
        input: 'put(1,10), put(1,20), get(1)',
        expectedOutput: '20',
        isHidden: false,
        explanation: 'Updating an existing key should not increase cache size.'
      },
      {
        id: 'tc-3',
        name: 'Capacity of 1 Edge Case',
        input: 'put(10,100), put(20,200), get(10), get(20)',
        expectedOutput: '[-1, 200]',
        isHidden: true,
        explanation: 'Capacity 1 evicts previous on every insert.'
      },
      {
        id: 'tc-4',
        name: 'High Frequency Refresh Eviction Order',
        input: 'put(1,1), put(2,2), get(1), get(1), put(3,3), get(2), get(3)',
        expectedOutput: '[-1, 3]',
        isHidden: true,
        explanation: 'Multiple gets re-prioritize key 1 correctly.'
      },
      {
        id: 'tc-5',
        name: 'Stress Test: Sequential Re-inserts',
        input: 'repeat put/get operations 1000 times',
        expectedOutput: 'verified',
        isHidden: true
      }
    ]
  },
  {
    id: 'q-102',
    title: 'Serialize and Deserialize Binary Tree',
    difficulty: 'Hard',
    category: 'Algorithms',
    version: 'sha256:b14f82',
    timeLimitSec: 2,
    memoryLimitMB: 256,
    author: 'Platform Curated',
    description: `Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment.

Design an algorithm to serialize and deserialize a binary tree. There is no restriction on how your serialization/deserialization algorithm should work. You just need to ensure that a binary tree can be serialized to a string and this string can be deserialized to the original tree structure.`,
    constraints: [
      'The number of nodes in the tree is in the range [0, 10^4].',
      '-1000 <= Node.val <= 1000'
    ],
    examples: [
      {
        input: 'root = [1,2,3,null,null,4,5]',
        output: '[1,2,3,null,null,4,5]',
        explanation: 'Reconstructed tree must have identical node structure and values.'
      }
    ],
    starterCode: {
      javascript: `class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = this.right = null;
  }
}

/**
 * Encodes a tree to a single string.
 * @param {TreeNode} root
 * @return {string}
 */
function serialize(root) {
  if (!root) return "#";
  return \`\${root.val},\${serialize(root.left)},\${serialize(root.right)}\`;
}

/**
 * Decodes your encoded data to tree.
 * @param {string} data
 * @return {TreeNode}
 */
function deserialize(data) {
  const nodes = data.split(',');
  let idx = 0;

  function build() {
    if (idx >= nodes.length || nodes[idx] === '#') {
      idx++;
      return null;
    }
    const node = new TreeNode(parseInt(nodes[idx++], 10));
    node.left = build();
    node.right = build();
    return node;
  }

  return build();
}

console.log("Tree Codec loaded");`,
      typescript: `class TreeNode {
  val: number;
  left: TreeNode | null = null;
  right: TreeNode | null = null;
  constructor(val: number) { this.val = val; }
}

function serialize(root: TreeNode | null): string {
  if (!root) return "#";
  return \`\${root.val},\${serialize(root.left)},\${serialize(root.right)}\`;
}

function deserialize(data: string): TreeNode | null {
  const tokens = data.split(',');
  let i = 0;
  function dfs(): TreeNode | null {
    if (tokens[i] === '#') { i++; return null; }
    const node = new TreeNode(Number(tokens[i++]));
    node.left = dfs();
    node.right = dfs();
    return node;
  }
  return dfs();
}`,
      python: `class TreeNode:
    def __init__(self, x):
        self.val = x
        self.left = None
        self.right = None

class Codec:
    def serialize(self, root):
        vals = []
        def dfs(node):
            if not node:
                vals.append("#")
                return
            vals.append(str(node.val))
            dfs(node.left)
            dfs(node.right)
        dfs(root)
        return ",".join(vals)

    def deserialize(self, data):
        tokens = iter(data.split(","))
        def dfs():
            val = next(tokens)
            if val == "#":
                return None
            node = TreeNode(int(val))
            node.left = dfs()
            node.right = dfs()
            return node
        return dfs()
`,
      java: `public class Codec {
    public String serialize(TreeNode root) {
        return "";
    }
    public TreeNode deserialize(String data) {
        return null;
    }
}`,
      cpp: `class Codec {
public:
    string serialize(TreeNode* root) { return ""; }
    TreeNode* deserialize(string data) { return nullptr; }
};`,
      go: `package main

type Codec struct {}
`,
      csharp: `public class Codec {
    public string serialize(TreeNode root) { return ""; }
    public TreeNode deserialize(string data) { return null; }
}`
    },
    testCases: [
      {
        id: 'tc-201',
        name: 'Standard Binary Tree with Leaves',
        input: '[1, 2, 3, null, null, 4, 5]',
        expectedOutput: '[1, 2, 3, null, null, 4, 5]',
        isHidden: false
      },
      {
        id: 'tc-202',
        name: 'Empty Tree (null root)',
        input: '[]',
        expectedOutput: '[]',
        isHidden: false
      },
      {
        id: 'tc-203',
        name: 'Single Node Tree',
        input: '[42]',
        expectedOutput: '[42]',
        isHidden: true
      },
      {
        id: 'tc-204',
        name: 'Skewed Tree (Linear Left Chain)',
        input: '[1, 2, null, 3, null, 4]',
        expectedOutput: '[1, 2, null, 3, null, 4]',
        isHidden: true
      }
    ]
  },
  {
    id: 'q-103',
    title: 'Rate Limiter (Token Bucket Algorithm)',
    difficulty: 'Medium',
    category: 'System Design',
    version: 'sha256:f90a2c',
    timeLimitSec: 2,
    memoryLimitMB: 256,
    author: 'Platform Curated',
    description: `Implement an in-memory **Token Bucket Rate Limiter** suitable for API gateway throttling.

The class \`TokenBucketLimiter\` should support:
- \`constructor(capacity, refillRatePerSec)\`: Initialize with maximum capacity and refill rate in tokens per second.
- \`allowRequest(tokens = 1, timestampMs)\`: Return \`true\` if \`tokens\` can be deducted at \`timestampMs\`, else \`false\`. Tokens refill continuously based on elapsed time.`,
    constraints: [
      '1 <= capacity <= 1,000,000',
      '1 <= refillRatePerSec <= 100,000',
      'Timestamps are monotonically increasing.'
    ],
    examples: [
      {
        input: 'capacity = 3, refillRate = 1/sec\nallowRequest(1, t=0) => true\nallowRequest(1, t=0) => true\nallowRequest(1, t=0) => true\nallowRequest(1, t=0) => false (bucket empty)\nallowRequest(1, t=1000) => true (1 refilled)',
        output: '[true, true, true, false, true]',
        explanation: 'Bucket has 3 tokens. After consuming 3, it rejects until 1000ms later when 1 token refills.'
      }
    ],
    starterCode: {
      javascript: `class TokenBucketLimiter {
  constructor(capacity, refillRatePerSec) {
    this.capacity = capacity;
    this.refillRatePerSec = refillRatePerSec;
    this.tokens = capacity;
    this.lastRefillTimeMs = null;
  }

  allowRequest(tokens = 1, timestampMs = Date.now()) {
    if (this.lastRefillTimeMs === null) {
      this.lastRefillTimeMs = timestampMs;
    } else {
      const elapsedSec = (timestampMs - this.lastRefillTimeMs) / 1000;
      this.tokens = Math.min(this.capacity, this.tokens + elapsedSec * this.refillRatePerSec);
      this.lastRefillTimeMs = timestampMs;
    }

    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true;
    }
    return false;
  }
}

// Quick validation
const limiter = new TokenBucketLimiter(2, 1);
console.log("Req 1 (t=0):", limiter.allowRequest(1, 0));
console.log("Req 2 (t=0):", limiter.allowRequest(1, 0));
console.log("Req 3 (t=0):", limiter.allowRequest(1, 0)); // should be false
console.log("Req 4 (t=1000):", limiter.allowRequest(1, 1000)); // should be true
`,
      typescript: `class TokenBucketLimiter {
  private capacity: number;
  private refillRatePerSec: number;
  private tokens: number;
  private lastRefillMs: number | null = null;

  constructor(capacity: number, refillRatePerSec: number) {
    this.capacity = capacity;
    this.refillRatePerSec = refillRatePerSec;
    this.tokens = capacity;
  }

  allowRequest(tokens: number = 1, timestampMs: number = Date.now()): boolean {
    if (this.lastRefillMs === null) {
      this.lastRefillMs = timestampMs;
    } else {
      const elapsedSec = (timestampMs - this.lastRefillMs) / 1000;
      this.tokens = Math.min(this.capacity, this.tokens + elapsedSec * this.refillRatePerSec);
      this.lastRefillMs = timestampMs;
    }

    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true;
    }
    return false;
  }
}`,
      python: `class TokenBucketLimiter:
    def __init__(self, capacity: int, refill_rate_per_sec: float):
        self.capacity = capacity
        self.refill_rate = refill_rate_per_sec
        self.tokens = capacity
        self.last_refill_ms = None

    def allow_request(self, tokens: int = 1, timestamp_ms: int = 0) -> bool:
        if self.last_refill_ms is None:
            self.last_refill_ms = timestamp_ms
        else:
            elapsed_sec = (timestamp_ms - self.last_refill_ms) / 1000.0
            self.tokens = min(self.capacity, self.tokens + elapsed_sec * self.refill_rate)
            self.last_refill_ms = timestamp_ms

        if self.tokens >= tokens:
            self.tokens -= tokens
            return True
        return False

limiter = TokenBucketLimiter(3, 1.0)
print(limiter.allow_request(1, 0))
print(limiter.allow_request(1, 0))
print(limiter.allow_request(1, 0))
print(limiter.allow_request(1, 0)) # False
print(limiter.allow_request(1, 1000)) # True
`,
      java: `public class TokenBucketLimiter {
    // Implementation
}`,
      cpp: `class TokenBucketLimiter {
    // Implementation
};`,
      go: `package main
`,
      csharp: `public class TokenBucketLimiter {
}`
    },
    testCases: [
      {
        id: 'tc-301',
        name: 'Burst handling within capacity',
        input: 'capacity=5, refill=1, 5 requests at t=0',
        expectedOutput: '[true, true, true, true, true]',
        isHidden: false
      },
      {
        id: 'tc-302',
        name: 'Exceeding burst capacity',
        input: 'capacity=2, refill=1, 3 requests at t=0',
        expectedOutput: '[true, true, false]',
        isHidden: false
      },
      {
        id: 'tc-303',
        name: 'Refill over partial seconds',
        input: 'capacity=10, refill=2, request at t=0, wait 500ms, request at t=500',
        expectedOutput: 'true',
        isHidden: true
      },
      {
        id: 'tc-304',
        name: 'Capacity saturation cap check',
        input: 'wait 10 seconds, tokens should not exceed capacity',
        expectedOutput: 'tokens == capacity',
        isHidden: true
      }
    ]
  }
];

export const INITIAL_SCORECARD_CHIDI: Scorecard = {
  id: 'sc-chidi-1',
  interviewId: 'int-002',
  interviewerName: 'Ines Becker (Staff Engineer)',
  submittedAt: '2026-11-01 15:42 UTC',
  categories: [
    {
      id: 'cat-1',
      name: 'Problem Solving',
      score: 4,
      feedback: 'Quickly identified doubly-linked list + hash map requirement for O(1) eviction without prompts. Handled capacity 1 edge case smoothly.'
    },
    {
      id: 'cat-2',
      name: 'Code Quality',
      score: 4,
      feedback: 'Very clean separation of node pointer manipulations and cache bookkeeping. Idiomatic JavaScript/TypeScript conventions used throughout.'
    },
    {
      id: 'cat-3',
      name: 'Communication',
      score: 3,
      feedback: 'Articulated trade-offs clearly before writing code. Paused to check assumptions regarding concurrent thread safety.'
    },
    {
      id: 'cat-4',
      name: 'Testing',
      score: 4,
      feedback: 'Walked through unit test cases step by step, including empty cache, key overwrite, and eviction sequence order before hitting Run.'
    }
  ],
  summary: 'Chidi demonstrated exceptional command of fundamental data structures and algorithmic complexity. Delivered a production-grade LRU Cache implementation with clean O(1) performance and all test cases passing on the first attempt.',
  recommendation: 'Strong Hire'
};

export const INITIAL_SCORECARD_LIAM: Scorecard = {
  id: 'sc-liam-1',
  interviewId: 'int-005',
  interviewerName: 'Sarah Chen (Senior Staff)',
  submittedAt: '2026-11-01 10:15 UTC',
  categories: [
    {
      id: 'cat-1',
      name: 'Problem Solving',
      score: 3,
      feedback: 'Good algorithmic approach. Quickly handled the rate limiter calculation with clear time-delta conversions.'
    },
    {
      id: 'cat-2',
      name: 'Code Quality',
      score: 4,
      feedback: 'Clean modular code structure with excellent variable naming and error handling.'
    },
    {
      id: 'cat-3',
      name: 'Testing',
      score: 3,
      feedback: 'Verified with multiple edge cases. Passed all 5/5 hidden validation tests.'
    }
  ],
  summary: 'Liam solved both problems within the async allotted window with solid architectural structure and high test coverage. Recommend advancing to loop team match.',
  recommendation: 'Hire'
};

export const INITIAL_INTERVIEWS: Interview[] = [
  {
    id: 'int-001',
    candidateName: 'Elena Rostova',
    candidateEmail: 'elena.rostova@example.com',
    role: 'Principal Distributed Systems Engineer',
    type: 'Live',
    status: 'Scheduled',
    scheduledDate: '2026-11-02 16:30 UTC',
    durationMinutes: 60,
    interviewerNames: ['Ines Becker', 'Marcus Vance'],
    questionIds: ['q-101', 'q-103'],
    activeQuestionId: 'q-101',
    code: {
      javascript: INITIAL_QUESTIONS[0].starterCode.javascript,
      typescript: INITIAL_QUESTIONS[0].starterCode.typescript,
      python: INITIAL_QUESTIONS[0].starterCode.python,
      java: INITIAL_QUESTIONS[0].starterCode.java,
      cpp: INITIAL_QUESTIONS[0].starterCode.cpp,
      go: INITIAL_QUESTIONS[0].starterCode.go,
      csharp: INITIAL_QUESTIONS[0].starterCode.csharp,
    },
    selectedLanguage: 'javascript',
    notes: 'Candidate joined 2 minutes early. Discussing eviction policy requirements. Good conversational demeanor.',
    integritySignals: [
      {
        id: 'sig-1',
        type: 'WINDOW_FOCUS',
        timestamp: '16:32:10',
        details: 'Candidate window in focus. Dual monitors detected.',
        severity: 'low'
      }
    ],
    totalRuns: 3,
    firstRunTimeMs: 142000,
    visibleTestsPassed: 2,
    visibleTestsTotal: 2,
    questionHistory: {},
  },
  {
    id: 'int-002',
    candidateName: 'Chidi Anagonye',
    candidateEmail: 'chidi.a@oxford.ac.uk',
    role: 'Senior Backend Engineer (Execution Team)',
    type: 'Live',
    status: 'Completed',
    scheduledDate: '2026-11-01 14:00 UTC',
    durationMinutes: 60,
    interviewerNames: ['Ines Becker'],
    questionIds: ['q-101'],
    activeQuestionId: 'q-101',
    code: {
      javascript: INITIAL_QUESTIONS[0].starterCode.javascript,
      typescript: INITIAL_QUESTIONS[0].starterCode.typescript,
      python: INITIAL_QUESTIONS[0].starterCode.python,
      java: INITIAL_QUESTIONS[0].starterCode.java,
      cpp: INITIAL_QUESTIONS[0].starterCode.cpp,
      go: INITIAL_QUESTIONS[0].starterCode.go,
      csharp: INITIAL_QUESTIONS[0].starterCode.csharp,
    },
    selectedLanguage: 'typescript',
    notes: 'Strong candidate. Solved LRU in under 25 minutes with thorough test verification.',
    scorecard: INITIAL_SCORECARD_CHIDI,
    integritySignals: [
      {
        id: 'sig-2',
        type: 'PASTE_EVENT',
        timestamp: '14:12:05',
        details: 'Candidate pasted 4 lines (128 bytes) of example test inputs from the question panel.',
        severity: 'low'
      },
      {
        id: 'sig-3',
        type: 'WINDOW_BLUR',
        timestamp: '14:28:44',
        details: 'Window lost focus for 4.2 seconds (interviewer shared terminal reference).',
        severity: 'low'
      }
    ],
    totalRuns: 7,
    firstRunTimeMs: 245000,
    visibleTestsPassed: 2,
    visibleTestsTotal: 2,
    questionHistory: {},
  },
  {
    id: 'int-003',
    candidateName: 'Devon Miller',
    candidateEmail: 'devon.miller@fastmail.com',
    role: 'Full Stack Engineer',
    type: 'Live',
    status: 'Scorecard Due',
    scheduledDate: '2026-11-01 11:00 UTC',
    durationMinutes: 45,
    interviewerNames: ['Alex Rivera'],
    questionIds: ['q-103'],
    activeQuestionId: 'q-103',
    code: {
      javascript: INITIAL_QUESTIONS[2].starterCode.javascript,
      typescript: INITIAL_QUESTIONS[2].starterCode.typescript,
      python: INITIAL_QUESTIONS[2].starterCode.python,
      java: INITIAL_QUESTIONS[2].starterCode.java,
      cpp: INITIAL_QUESTIONS[2].starterCode.cpp,
      go: INITIAL_QUESTIONS[2].starterCode.go,
      csharp: INITIAL_QUESTIONS[2].starterCode.csharp,
    },
    selectedLanguage: 'python',
    notes: 'Implemented TokenBucket with timestamp math. Ran into minor rounding issue at 500ms refill.',
    integritySignals: [],
    totalRuns: 4,
    firstRunTimeMs: 310000,
    visibleTestsPassed: 2,
    visibleTestsTotal: 2,
    questionHistory: {},
  },
  {
    id: 'int-004',
    candidateName: 'Priya Sharma',
    candidateEmail: 'priya.sharma@techcorp.io',
    role: 'Staff Infrastructure Engineer',
    type: 'Live',
    status: 'Scheduled',
    scheduledDate: '2026-11-02 09:00 UTC (Tomorrow)',
    durationMinutes: 60,
    interviewerNames: ['Marcus Vance', 'Sarah Chen'],
    questionIds: ['q-102', 'q-103'],
    activeQuestionId: 'q-102',
    code: {
      javascript: INITIAL_QUESTIONS[1].starterCode.javascript,
      typescript: INITIAL_QUESTIONS[1].starterCode.typescript,
      python: INITIAL_QUESTIONS[1].starterCode.python,
      java: INITIAL_QUESTIONS[1].starterCode.java,
      cpp: INITIAL_QUESTIONS[1].starterCode.cpp,
      go: INITIAL_QUESTIONS[1].starterCode.go,
      csharp: INITIAL_QUESTIONS[1].starterCode.csharp,
    },
    selectedLanguage: 'python',
    notes: 'Pre-session calendar sync confirmed. System check completed.',
    integritySignals: [],
    totalRuns: 0,
    visibleTestsPassed: 0,
    visibleTestsTotal: 2,
    questionHistory: {},
  },
  {
    id: 'int-005',
    candidateName: 'Liam O’Connor',
    candidateEmail: 'liam.oc@dublin.ie',
    role: 'Senior Backend Engineer',
    type: 'Async',
    status: 'Completed',
    scheduledDate: '2026-11-01 08:30 UTC',
    durationMinutes: 90,
    interviewerNames: ['Automated Grading Harness'],
    questionIds: ['q-101', 'q-103'],
    activeQuestionId: 'q-101',
    code: {
      javascript: INITIAL_QUESTIONS[0].starterCode.javascript,
      typescript: INITIAL_QUESTIONS[0].starterCode.typescript,
      python: INITIAL_QUESTIONS[0].starterCode.python,
      java: INITIAL_QUESTIONS[0].starterCode.java,
      cpp: INITIAL_QUESTIONS[0].starterCode.cpp,
      go: INITIAL_QUESTIONS[0].starterCode.go,
      csharp: INITIAL_QUESTIONS[0].starterCode.csharp,
    },
    selectedLanguage: 'javascript',
    notes: 'Submitted on time. 5/5 hidden tests passed. Reviewer rubric confirmed.',
    scorecard: INITIAL_SCORECARD_LIAM,
    integritySignals: [
      {
        id: 'sig-5',
        type: 'WINDOW_BLUR',
        timestamp: '08:52:19',
        details: 'Window blurred for 14.8 seconds.',
        severity: 'medium'
      }
    ],
    totalRuns: 9,
    firstRunTimeMs: 180000,
    visibleTestsPassed: 2,
    visibleTestsTotal: 2,
    questionHistory: {},
  }
];

export const INITIAL_ASSESSMENTS: AssessmentAttempt[] = [
  {
    id: 'asmt-001',
    candidateName: 'Jordan Taylor',
    candidateEmail: 'jordan.taylor@univ.edu',
    assessmentTitle: 'Senior Software Engineering Core Assessment 2026',
    status: 'In Progress',
    timeRemainingSeconds: 3120, // 52 minutes
    totalTimeMinutes: 90,
    startedAt: '2026-11-01 16:00 UTC',
    questionIds: ['q-101', 'q-103'],
    currentQuestionIndex: 0,
    answers: {
      'q-101': {
        code: INITIAL_QUESTIONS[0].starterCode.javascript,
        language: 'javascript'
      }
    },
    integritySignals: []
  },
  {
    id: 'asmt-002',
    candidateName: 'Maya Lin',
    candidateEmail: 'maya.lin@mit.edu',
    assessmentTitle: 'Distributed Systems & Data Structures Screening',
    status: 'Graded',
    timeRemainingSeconds: 0,
    totalTimeMinutes: 90,
    startedAt: '2026-11-01 11:00 UTC',
    submittedAt: '2026-11-01 12:18 UTC',
    questionIds: ['q-101', 'q-102'],
    currentQuestionIndex: 1,
    answers: {
      'q-101': {
        code: INITIAL_QUESTIONS[0].starterCode.typescript,
        language: 'typescript'
      }
    },
    score: 92,
    integritySignals: []
  },
  {
    id: 'asmt-003',
    candidateName: 'Samuel Adebayo',
    candidateEmail: 's.adebayo@lagos.tech',
    assessmentTitle: 'Senior Backend Concurrency Screening',
    status: 'Submitted',
    timeRemainingSeconds: 0,
    totalTimeMinutes: 60,
    startedAt: '2026-11-01 09:30 UTC',
    submittedAt: '2026-11-01 10:25 UTC',
    questionIds: ['q-103'],
    currentQuestionIndex: 0,
    answers: {
      'q-103': {
        code: INITIAL_QUESTIONS[2].starterCode.python,
        language: 'python'
      }
    },
    integritySignals: []
  }
];

export const INITIAL_STAFF_MEMBERS: UserProfile[] = [
  {
    id: 'user-001',
    name: 'Ines Becker',
    email: 'ines.becker@acme.corp',
    role: 'Interviewer',
    allowedRoles: ['Interviewer', 'Admin'],
    organization: 'Acme Corporation',
    team: 'Distributed Systems',
    mfaEnabled: true,
    status: 'active',
    lastActive: '5 minutes ago',
  },
  {
    id: 'user-002',
    name: 'Marcus Vance',
    email: 'marcus.v@acme.corp',
    role: 'Admin',
    allowedRoles: ['Admin', 'Interviewer'],
    organization: 'Acme Corporation',
    team: 'Infrastructure Security',
    mfaEnabled: true,
    status: 'active',
    lastActive: '12 minutes ago',
  },
  {
    id: 'user-003',
    name: 'Chloe Dubois',
    email: 'chloe.d@acme.corp',
    role: 'Interviewer',
    allowedRoles: ['Interviewer'],
    organization: 'Acme Corporation',
    team: 'Talent Acquisition',
    mfaEnabled: true,
    status: 'active',
    lastActive: '1 hour ago',
  },
  {
    id: 'user-004',
    name: 'Dr. Aris Thorne',
    email: 'aris.t@acme.corp',
    role: 'Interviewer',
    allowedRoles: ['Interviewer'],
    organization: 'Acme Corporation',
    team: 'Core Platform Engineering',
    mfaEnabled: false,
    status: 'active',
    lastActive: '3 hours ago',
  },
  {
    id: 'user-005',
    name: 'Kavita Rao',
    email: 'kavita.r@acme.corp',
    role: 'Interviewer',
    allowedRoles: ['Interviewer'],
    organization: 'Acme Corporation',
    team: 'Engineering Education',
    mfaEnabled: true,
    status: 'active',
    lastActive: 'Yesterday',
  },
  {
    id: 'user-006',
    name: 'Devon Lee',
    email: 'devon.l@acme.corp',
    role: 'Interviewer',
    allowedRoles: ['Interviewer'],
    organization: 'Acme Corporation',
    team: 'Frontend Platform',
    mfaEnabled: false,
    status: 'invited',
    lastActive: 'Invitation sent 2 days ago',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-1092',
    timestamp: '2026-11-02 06:28 UTC',
    actor: 'Marcus Vance',
    actorEmail: 'marcus.v@acme.corp',
    role: 'Admin',
    action: 'MFA Policy Enforced for All Staff',
    category: 'Settings',
    target: 'Security Policies',
    result: 'Success',
    ipAddress: '192.0.2.45',
    device: 'macOS Chrome 130',
    requestId: 'req-98fa-2231',
    details: 'Enforced FIDO2/TOTP requirement for all 18 active seats.',
  },
  {
    id: 'aud-1091',
    timestamp: '2026-11-02 05:14 UTC',
    actor: 'Chloe Dubois',
    actorEmail: 'chloe.d@acme.corp',
    role: 'Interviewer',
    action: 'Interview Scheduled',
    category: 'Interviews',
    target: 'Elena Rostova (int-001)',
    result: 'Success',
    ipAddress: '198.51.100.12',
    device: 'Windows 11 Edge',
    requestId: 'req-44ba-1102',
    details: 'Pinned LRU Cache (q-101) & Token Bucket (q-103). Candidate link issued.',
  },
  {
    id: 'aud-1090',
    timestamp: '2026-11-02 04:02 UTC',
    actor: 'Kavita Rao',
    actorEmail: 'kavita.r@acme.corp',
    role: 'Interviewer',
    action: 'Question Validated & Published',
    category: 'Questions',
    target: 'Token Bucket Rate Limiter (q-103)',
    result: 'Success',
    ipAddress: '203.0.113.88',
    device: 'Linux Firefox',
    requestId: 'req-12dd-8891',
    details: 'Reference solution passed 3 visible + 2 hidden test cases in 44ms.',
  },
  {
    id: 'aud-1089',
    timestamp: '2026-11-01 14:48 UTC',
    actor: 'Ines Becker',
    actorEmail: 'ines.becker@acme.corp',
    role: 'Interviewer',
    action: 'Scorecard Submitted',
    category: 'Evaluation',
    target: 'Chidi Anagonye (int-002)',
    result: 'Success',
    ipAddress: '192.0.2.18',
    device: 'macOS Safari 18',
    requestId: 'req-65ae-9901',
    details: 'Final recommendation: Strong Hire. Rubric score 3.75/4.0.',
  },
  {
    id: 'aud-1088',
    timestamp: '2026-11-01 11:20 UTC',
    actor: 'Marcus Vance',
    actorEmail: 'marcus.v@acme.corp',
    role: 'Admin',
    action: 'API Key Generated',
    category: 'Settings',
    target: 'Greenhouse ATS Sync Key',
    result: 'Success',
    ipAddress: '192.0.2.45',
    device: 'macOS Chrome 130',
    requestId: 'req-77cc-3312',
    details: 'Created key cr_live_gh918*** with interviews:write scope.',
  },
  {
    id: 'aud-1087',
    timestamp: '2026-10-31 18:30 UTC',
    actor: 'Marcus Vance',
    actorEmail: 'marcus.v@acme.corp',
    role: 'Admin',
    action: 'Candidate Data Purge Executed (A-08)',
    category: 'Data',
    target: 'Candidate #8841 (GDPR Erasure)',
    result: 'Success',
    ipAddress: '192.0.2.45',
    device: 'macOS Chrome 130',
    requestId: 'req-00fa-5512',
    details: 'Database records, submitted code artifacts, and replay logs purged. Minimal de-identified audit kept.',
  },
];

export const INITIAL_API_KEYS: ApiKey[] = [
  {
    id: 'key-01',
    name: 'Greenhouse Production ATS Sync',
    prefix: 'cr_live_gh981...',
    createdAt: '2026-10-15',
    lastUsedAt: '12 minutes ago',
    scopes: ['interviews:read', 'interviews:write', 'assessments:read', 'reports:read'],
  },
  {
    id: 'key-02',
    name: 'Lever Webhook Dispatcher',
    prefix: 'cr_live_lv234...',
    createdAt: '2026-09-02',
    lastUsedAt: 'Yesterday',
    scopes: ['assessments:write', 'webhooks:manage'],
  },
];

export const INITIAL_WEBHOOKS: WebhookEndpoint[] = [
  {
    id: 'wh-01',
    url: 'https://api.acme.corp/webhooks/coderoom-events',
    events: ['interview.ended', 'scorecard.submitted', 'assessment.graded'],
    status: 'Active',
    deliveriesCount: 1420,
  },
  {
    id: 'wh-02',
    url: 'https://security.acme.corp/siem/audit-stream',
    events: ['audit.entry_created', 'security.alert'],
    status: 'Active',
    deliveriesCount: 8840,
  },
];


