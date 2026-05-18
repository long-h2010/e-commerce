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

export const buildTreeData = <T extends { id: string; parentId?: string }, R>(
  items: T[],
  transform: (item: T) => R,
): (R & { children?: R[] })[] => {
  const map = new Map<string, R & { children: R[] }>();
  const roots: (R & { children: R[] })[] = [];

  items.forEach((item) => {
    map.set(item.id, { ...transform(item), children: [] });
  });

  items.forEach((item) => {
    const node = map.get(item.id)!;
    const parent = map.get(item.parentId ?? '');

    if (item.parentId) {
      if (parent) parent.children.push(node);
      else roots.push(node);
    } else {
      roots.push(node);
    }
  });

  return removeEmptyChildren(roots);
};
