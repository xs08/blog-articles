
class LRUCache {
  constructor(limit) {
    if (!limit || typeof limit !== 'number') {
      throw new TypeError('limit must be a number')
    }

    this._limit = limit
    this._size = 0
    this._map = new Map()
    this._head = this._tail = null
  }

  get(key) {
    const node = this._map.get(key)
    // 不存在node
    if (!node) return
    // 该节点为头结点
    if (node === this._head) return node.value
    
    // 否则将该节点移动到头部

    // 前驱节点变更
    if (node.prev) {
      if (node === this._tail) {
        this.tail = node.prev
      }
      // 后续节点交给前驱节点的后续
      node.prev.next = node.next
    }
    // 后续节点变更
    if (node.next) {
      node.next.prev = node.prev
    }
    // head　节点变更
    if (this._head) {
      this._head.prev = node
    }
    this._head = node
    return node.value
  }

  set(key, value) {
    let node = this._map.get(key)
    // 不存在该节点
    if (!node) {
      // 容量检查. 移除尾部节点
      if (this._size === this._limit) {
        // 移除尾部节点
        this._tail = this._tail.prev
        this._tail.next = null

        this._map.delete(key)
        this._size --
      }

      node = { key, value }
      this._map.set(key, node)

      if (this._head) {
        this._head.prev = node
        this._head = node
      } else {
        this._head = node
        this._tail = node
      }

      this._size ++
    }

    node.value = value
  }
}

export default LRUCache
