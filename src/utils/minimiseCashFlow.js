import Expense from "../classes/expense";
function upheapify(heap, idx) {
  if (idx === 0) return;
  var parent_idx = Math.floor((idx - 1) / 2);

  if (heap[parent_idx].first < heap[idx].first) {
    var temp = heap[parent_idx];
    heap[parent_idx] = heap[idx];
    heap[idx] = temp;
    upheapify(heap, parent_idx);
  } else {
    return;
  }
}
function downheapify(heap, idx) {
  var left_child_idx = 2 * idx + 1;
  var right_child_idx = 2 * idx + 2;
  if (left_child_idx >= heap.length && right_child_idx >= heap.length) return;
  var largest = idx;
  if (left_child_idx < heap.length && heap[left_child_idx].first > heap[largest].first) {
    largest = left_child_idx;
  }
  if (right_child_idx < heap.length && heap[right_child_idx].first > heap[largest].first) {
    largest = right_child_idx;
  }
  if (largest === idx) return;

  var temp = heap[largest];
  heap[largest] = heap[idx];
  heap[idx] = temp;
  downheapify(heap, largest);
}
function push_heap(heap, key, val) {
  var ob = { first: key, second: val };
  heap.push(ob);
  upheapify(heap, heap.length - 1);
}
function pop_heap(heap) {
  if (heap.length === 0) return 0;
  var i = heap.length - 1;
  var temp = heap[0];
  heap[0] = heap[i];
  heap[i] = temp;
  heap.pop();
  downheapify(heap, 0);
}
function heap_top(heap) {
  if (heap.length === 0) {
    return;
  }
  return heap[0];
}
export function minimiseCashFlow(transactions) {
  var net_balance = {};
  for (var i = 0; i < transactions.length; i++) {
    var e = transactions[i]; 
    if (e.person1 in net_balance) {
      net_balance[e.person1] += e.amount;
    } else {
			net_balance[e.person1] = e.amount;
    }
    if (e.person2 in net_balance) {
      net_balance[e.person2] -= e.amount;
    } else {
      net_balance[e.person2] = -e.amount;
    }
  }
  var positive = []; 	
  var negative = []; 
  for (const person in net_balance) {
    if (net_balance[person] > 0) {
      push_heap(positive, net_balance[person], person);
    } else {
      push_heap(negative, -1 * net_balance[person], person);
    }
  }
  var result = []; 
  while (positive.length > 0) {
    var p1 = heap_top(positive);
    var p2 = heap_top(negative);
    pop_heap(positive);
    pop_heap(negative);
    let exp = new Expense(p2.second, p1.second, Math.min(p1.first, p2.first));
    result.push(exp);
    if (p1.first > p2.first) {
      push_heap(positive, p1.first - p2.first, p1.second);
    } else if (p1.first < p2.first) {
      push_heap(negative, p2.first - p1.first, p2.second);
    }
  }
  return result;
}
