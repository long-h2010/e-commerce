const removeEmptyChildren = (nodes: any[]): any[] => {
  return nodes.map((node) => {
    const newNode = { ...node };

    if (newNode.children && newNode.children.length > 0) {
      newNode.children = removeEmptyChildren(newNode.children);
    } else {
      delete newNode.children;
    }

    return newNode;
  });
};

export const buildTreeData = (items: any[]): any[] => {
  const map = new Map();
  const roots: any[] = [];

  items.forEach((item) => {
    map.set(item.id, { ...item, children: [] });
  });

  items.forEach((item) => {
    const node = map.get(item.id);

    if (item.parentId) {
      const parent = map.get(item.parentId);
      if (parent) parent.children.push(node);
    } else roots.push(node);
  });

  return removeEmptyChildren(roots);
};
