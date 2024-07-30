import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

function FillExample({titulo1,titulo2,titulo3}) {
  return (
    <Tabs
    defaultActiveKey="profile"
    id="fill-tab-example"
    className="mb-3"
    fill
    >
      <Tab eventKey="home" title="Home">
      <h1 className='titulo_tabs'>{titulo1}</h1>
      </Tab>
      <Tab eventKey="profile" title="Profile">
      <h1 className='titulo_tabs'>{titulo2}</h1>
      </Tab>
      <Tab eventKey="longer-tab" title="Loooonger Tab">
        <h1 className='titulo_tabs'>{titulo3}</h1>
      </Tab>
    </Tabs>
  );
}

export default FillExample;