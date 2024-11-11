import './root.less'
import PersonIcon from '@mui/icons-material/Person';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import GetAppIcon from '@mui/icons-material/GetApp';
import ImageIcon from '@mui/icons-material/Image';
import { useState } from 'react';



export default function Root() {
  const [key,setKey] = useState('EXTRA')
  const keyDict = [
    {
      title:'AI工具',
      key: 'AI_TOOL'
    },
    {
      title:'其它',
      key: 'EXTRA'
    }
  ]
    return (
      <>
        <div id="sidebar">
          <h1>AI Image Tools</h1>
            <div className="tab-list">
            {
              keyDict.map((item,index) => (                
                  <div key={index} onClick={()=>{
                    setKey(item.key)
                  }
                    } className={ item.key === key ? 'tab-item toggle':'tab-item'}>
                    {item.title}
                  </div>
                
              ))
            }              
            </div>
          <div className='bottom-list'>
              {
                key === 'AI_TOOL' &&
                <>
                  <li>
                    <PersonIcon fontSize='large' color='error'></PersonIcon>
                    <a href={`/img/seg-person`}>分割人像</a>
                  </li>
                  <li>
                    <AspectRatioIcon fontSize='large'
                    color='error'></AspectRatioIcon>
                    <a href={`/img/expand-img`}>扩展图片</a>
                  </li>
              </>}
              {
                key === 'EXTRA' && 
                
                <>
                  <li>
                    <ImageIcon fontSize='large' color='info'>
                    </ImageIcon>
                    <a href={`/img/img-editor`}>Canvas Drawer</a>
                  </li>

                  <li>
                    <GetAppIcon fontSize='large' color='info'>
                    </GetAppIcon>
                    <a href={`/utils/img-cover`}>Canvas Download</a>
                  </li>

                  <li>
                    <AcUnitIcon fontSize='large' color='info'>
                    </AcUnitIcon>
                    <a href={`/utils/data-transfer`}>Data Transfer Demo</a>
                  </li>
                </>
              
              }
          </div>
        </div>
        <div id="detail"></div>
      </>
    );
  }