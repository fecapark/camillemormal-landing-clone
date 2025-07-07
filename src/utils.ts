export const reverseNodeList = (nodeList: NodeList) => {
  return Array.from(nodeList).reverse();
};

export const debounce = (func: () => void, delay: number) => {
  let timeout: number;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(func, delay);
  };
};
