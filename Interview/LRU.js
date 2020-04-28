// LRUCache: Least Recent Used 
class LRUCache {
  constructor(limit) {
    if (!limit || typeof limit !== 'number') {
      throw new TypeError('limit must be a number')
    }

    this._limit = limit
    this._size = 0
    this._head = this._tail = undefined
    this._map = new Map()
  }

  get(key) {
    const node  = this._map.get(key)
    // 空节点直接返回
    if (!node) {
      return
    }

    // 头结点直接返回
    if (node === this._head) {
      return node.value
    }

    // 是否有前置节点
    if (node.prev) {
      node.prev.next = node.next

      if (node === this._tail) {
        node.prev.next = undefined
        this._tail = node.prev
      }
    }
    // 是否有后置节点
    if (node.next) {
      node.next.prev = node.prev
    }

    node.prev = undefined
    
    // 处理头结点
    if (this._head) {
      node.next = this._head
      this._head.prev = node
    }
    // 替换头结点
    this._head = node

    return node.value
  }

  set(key, value) {
    let node = this._map.get(key)
    if (!node) {
      // 容量超限
      if (this._size === this._limit) {
        this._map.delete(this._tail.key)
        
        this._tail = this._tail.prev
        this._tail.next = undefined
        this._size --
      }

      node = { key, value }
      // 加入存储
      this._map.set(key, node)

      if (!this._head) {
        this._head = this._tail = node
      } else {
        // 加入链表
        this._tail.next = node
        node.prev = this._tail
        this._tail = node
      }

      this._size ++
    }
    node.value = value
  }

  _print() {
    let node = this._head
    let index = 1
    while(node) {
      console.log(`${index}`, node)
      node = node.next
      index ++
    }
  }
}

export default LRUCache
