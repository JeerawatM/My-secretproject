
import React, { useState } from 'react';
import '../App.css';


interface Category {
  id: string;
  name: string;
  image: string;
}

interface ItemProps {
  id: string;
  imageSrc: string;
  title: string;
  region: string;
}


const Item: React.FC<ItemProps> = ({ id, imageSrc, title }) => {
  return (
    <div id={id} className="wat">
      <div className="image-container">
        <img id="imagewatthai" className="imagewatthai2" src={imageSrc} alt={title} />
      </div>
      <h3>{title}</h3>
    </div>
  );
};


const Uxui = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null); 
  const [columns, setColumns] = useState<number>(3);
  const [autoplay, setAutoplay] = useState<boolean>(true);


  const categories: Category[] = [
    { id: 'north', name: 'ภาคเหนือ', image: 'https://sukoldha.com/wp-content/uploads/2023/01/jfblepyqvopy-1024x683.webp' },
    { id: 'central', name: 'ภาคกลาง', image: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Wat_Ratchabophit_%283%29.jpg' },
    { id: 'south', name: 'ภาคใต้', image: 'https://upload.wikimedia.org/wikipedia/commons/0/09/%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%98%E0%B8%B2%E0%B8%95%E0%B8%B8%E0%B8%A7%E0%B8%A3%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%A7%E0%B8%B4%E0%B8%AB%E0%B8%B2%E0%B8%A3.jpg' },

  ];


  const allTemples: ItemProps[] = [

    { id: 'watthai1', imageSrc: 'https://sukoldha.com/wp-content/uploads/2023/01/jfblepyqvopy-1024x683.webp', title: 'วัดสวนดอก', region: 'north' },
    { id: 'watthai2', imageSrc: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Wat_Phra_That_Doi_Suthep_%28I%29.jpg', title: 'วัดพระธาตุดอยสุเทพ', region: 'north' },
    { id: 'watthai3', imageSrc: 'https://www.dhammathai.org/watthai/data/imagedb/107-1.jpg', title: 'วัดเจดีย์หลวงวรวิหาร', region: 'north' },

    { id: 'watthai4', imageSrc: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/%E0%B9%80%E0%B8%88%E0%B8%94%E0%B8%B5%E0%B8%A2%E0%B9%8C%E0%B8%9B%E0%B8%A3%E0%B8%B0%E0%B8%98%E0%B8%B2%E0%B8%99%E0%B8%97%E0%B8%A3%E0%B8%87%E0%B8%9B%E0%B8%A3%E0%B8%B2%E0%B8%87%E0%B8%84%E0%B9%8C%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%AD%E0%B8%A3%E0%B8%B8%E0%B8%932.jpg', title: 'วัดอรุณราชวรารามราชวรมหาวิหาร', region: 'central' },
    { id: 'watthai5', imageSrc: 'https://cms.dmpcdn.com/travel/2021/08/06/f6bee040-f690-11eb-8d2d-519418dcfda4_original.jpg', title: 'วัดพระศรีรัตนศาสดาราม', region: 'central' },
    { id: 'watthai6', imageSrc: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%A7%E0%B8%B4%E0%B8%AB%E0%B8%B2%E0%B8%A3%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%AA%E0%B8%B8%E0%B8%97%E0%B8%B1%E0%B8%A8%E0%B8%99%E0%B9%8C2.jpg', title: 'วัดสุทัศนเทพวรารามราชวรมหาวิหาร', region: 'central' },
    { id: 'watthai7', imageSrc: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Wat_Ratchabophit_%283%29.jpg', title: 'วัดราชบพิธสถิตมหาสีมารามราชวรวิหาร', region: 'central' },

    { id: 'watthai8', imageSrc: 'https://teawlay.com/wp-content/uploads/wat-chalong.jpg', title: 'วัดฉลอง (ภูเก็ต)', region: 'south' },
    { id: 'watthai9', imageSrc: 'https://upload.wikimedia.org/wikipedia/commons/0/09/%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%98%E0%B8%B2%E0%B8%95%E0%B8%B8%E0%B8%A7%E0%B8%A3%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%A7%E0%B8%B4%E0%B8%AB%E0%B8%B2%E0%B8%A3.jpg', title: 'วัดพระมหาธาตุวรมหาวิหาร (นครศรีธรรมราช)', region: 'south' },
  ];

  const filteredTemples = selectedRegion
    ? allTemples.filter(temple => temple.region === selectedRegion)
    : []; 

  return (
    <div id="temple" className="templeall">
      <h1 className="main-title">วัดไทย</h1>

      {!selectedRegion ? (

        <div className="categories-grid">
          {categories.map(category => (
            <div
              key={category.id}
              className="category-card"
              onClick={() => setSelectedRegion(category.id)}
            >
              <div className="category-image-wrapper">
                <img src={category.image} alt={category.name} />
              </div>
              <h2>{category.name}</h2>
            </div>
          ))}
        </div>
      ) : (
        <>
          <button className="back-button" onClick={() => setSelectedRegion(null)}>
            &larr; กลับไปยังหมวดหมู่
          </button>

          <h2 className="section-title">วัดใน{categories.find(cat => cat.id === selectedRegion)?.name || 'ภูมิภาคนี้'}</h2>

          <div className="controls">
            <label htmlFor="column-select">จำนวนคอลัมภ์: </label>
            <select
              id="column-select"
              value={columns}
              onChange={(e) => setColumns(Number(e.target.value))}
            >
              <option value={2}>2 คอลัมภ์</option>
              <option value={3}>3 คอลัมภ์</option>
              <option value={4}>4 คอลัมภ์</option>
            </select>

            <button onClick={() => setAutoplay(!autoplay)}>
              {autoplay ? 'ปิด Auto Play' : 'เปิด Auto Play'}
            </button>
          </div>

          <div className={`items-grid columns-${columns}`}>
            {filteredTemples.length > 0 ? (
              filteredTemples.map((item) => (
                <Item key={item.id} {...item} />
              ))
            ) : (
              <p className="no-items-message">
                ไม่พบข้อมูลวัดในหมวดหมู่นี้ หรือกำลังโหลดข้อมูล...
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Uxui;