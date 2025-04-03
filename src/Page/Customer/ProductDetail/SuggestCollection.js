import { Typography, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import ViewProduct from '../../../Component/ViewProduct';
import { Autoplay, Scrollbar } from 'swiper/modules';
import httpClient from '../../../Utils/request';
import { CLOTH_CATEGORY } from '../../../Config/App';

function SuggestCollection(props) {
  const [dataSource, setdataSource] = useState([]);
  const [Loading, setLoading] = useState(true);
  useEffect(() => {
    if (props.id !== undefined) {
      const Params = {
        "categoryId": props.id,
        "Sort": null,
        "pageSize": 20,
        "pageNo": 1
      };
      httpClient.post(CLOTH_CATEGORY, Params)
        .then((res) => {
          setLoading(false);
          res.data.forEach((item, index) => {
            res.data[index].image = item.imagePaths;
            res.data[index].model = item.code;
            res.data[index].category = item.category.name;
          })
          res.data = res.data.filter(item => item._id !== props.DontInclude);
          setdataSource([...res.data]);
        }).catch((err) => {
          setLoading(false);
          console.log(err);
        });
    }
  }, [props.id, props.DontInclude])
  return (
    <Spin spinning={Loading}>
      {dataSource.length > 0 &&
        <div className='position-relative'>
          <div className='d-flex justify-content-between M-Icon-Container-Detail'>
            <div className='M-Arrow-Swiper-Left user-select-none'>
              <LeftOutlined width={25} height={25}
                onClick={() => {
                  const swiper = document.getElementById('Swiper-ID').swiper;
                  swiper.slidePrev(1000);
                }} />
            </div>
            <div className='M-Arrow-Swiper-Right user-select-none'>
              <RightOutlined width={25} height={25} onClick={() => {
                const swiper = document.getElementById('Swiper-ID').swiper;
                swiper.slideNext(1000);
              }} />
            </div>
          </div>

          <div className='p-3 overflow-hidden' style={{ position: 'relative' }}>
            <div className='text-center'>
              <Typography.Title level={2}>
                YOU MAY ALSO LIKE
              </Typography.Title>
            </div>
            <div className='text-center'>
              <Typography.Text>
                A collection of related products that are good to buy together
              </Typography.Text>
            </div>
            <Swiper
              id='Swiper-ID'
              breakpoints={{
                0: {
                  slidesPerView: 2
                },
                400: {
                  slidesPerView: 2
                },
                700: {
                  slidesPerView: 4
                }
              }}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              slidesPerView={3}
              slidesPerGroup={1}
              spaceBetween={30}
              scrollbar={{
                draggable: true,
                dragSize: 60,
                snapOnRelease: true
              }}
              modules={[Autoplay, Scrollbar]}
              className="mySwiper mt-lg-4 mt-3"
            >
              {dataSource.map((item, index) => {
                return <SwiperSlide key={index}>
                  <ViewProduct Data={item} />
                </SwiperSlide>
              })}
            </Swiper>
          </div>
        </div>
      }
    </Spin>
  )
}



export default SuggestCollection;