function DynamicTabsList(props) {
  let items = [];
  for (let i = 0; i < props.numTabs; i++) {
    items.push(props.children(i));
  }
  return items;
}

export default DynamicTabsList;
