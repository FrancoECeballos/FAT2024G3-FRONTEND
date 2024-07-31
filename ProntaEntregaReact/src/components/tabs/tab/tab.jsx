import Tab from 'react-bootstrap/Tab';

function GenericTab({nombre,titulo,sub}) {
  return (
    <Tab style={{textAlign:'center'}} eventKey="home" title={nombre}>
      <h1 className='titulo_tabs'>{titulo}</h1>
      <h2>{sub}</h2>
    </Tab>
  );
}

export default GenericTab;