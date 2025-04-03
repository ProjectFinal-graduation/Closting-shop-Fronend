import React, { useEffect, useState } from 'react';
import { NumericFormat } from 'react-number-format';
import { List } from 'antd';
import httpClient from '../../../Utils/request';
import { REPORT } from '../../../Config/Admin';

export default function Dashboard() {
  const [Data, setData] = useState({
    totalRevenue: 0.0,
    count: {
      "totalOrders": 0,
      "totalPending": 0,
      "totalProcessing": 0,
      "totalCompleted": 0,
      "totalCancelled": 0
    },
    bestClothSeller: [
      {
        "total": 56,
        "cloth": "V-neck raglan short sleeve top",
        "id": "C000002"
      },
    ],
    bestSellersByCategory: [
      {
        "totalQuantitySold": 58,
        "category": {
          "id": "66d31de8938940e40da75de2",
          "name": "Top & T-shirt"
        }
      }
    ],
    salesByMonth: [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ],
  });

  useEffect(() => {
    httpClient.get(REPORT)
      .then((res) => {
        if (res.status === 200) {
          setData({ ...res.data });

          import('./init_chart').then((module) => {
            module.initializeChart(res.data.salesByMonth);
          }).catch(err => console.log('Error loading acquisitions.js:', err));

        }
      }).catch((err) => {
        console.log(err);
      });

  }, []);

  // useEffect(() => {

  // }, [Data])

  return (
    <div className='d-flex flex-column' style={{ height: "100%" }}>
      <div style={{ fontWeight: 600, fontSize: "26px" }}>
        <p className='p-0 m-0'>Total Revenue</p>
        <NumericFormat value={Data && Data.totalRevenue.toFixed(2)} displayType={'text'} thousandSeparator={true} prefix={"$"} />
      </div>

      <div className='row row-cols-lg-3 row-cols-md-2 row-cols-1 row-cols-xxl-5 gy-4 gx-4 mt-2 w-100'>
        <div className='col'>
          <div className='p-3 rounded-4 report-container' style={{ backgroundColor: "white", borderColor: "black", border: "1px solid" }}>
            <div className='w-100 pt-3 gap-1 pb-0'>
              <p className='p-0 m-0' style={{
                fontSize: "20px",
                fontWeight: 600,
              }}>Shipped Orders</p>
              <h2 className='p-0 text-end report-count'>{Data && Data.count?.totalOrders}</h2>
            </div>
          </div>
        </div>
        <div className='col'>
          <div className='p-3 rounded-4 report-container' style={{ backgroundColor: "white", borderColor: "black", border: "1px solid" }}>
            <div className='w-100 gap-1 pt-3 pb-0'>
              <p className='p-0 m-0' style={{
                fontSize: "20px",
                fontWeight: 600,
              }}>New Orders</p>
              <h2 className='p-0 text-end report-count'>{Data && Data.count?.totalPending}</h2>
            </div>
          </div>
        </div>
        <div className='col'>
          <div className='p-3 rounded-4 report-container' style={{ backgroundColor: "white", borderColor: "black", border: "1px solid" }}>
            <div className='w-100 gap-1 p-3 pb-0'>
              <p className='p-0 m-0' style={{
                fontSize: "20px",
                fontWeight: 600,
              }}>Processing Orders</p>
              <h2 className='p-0 text-end report-count'>{Data && Data.count?.totalProcessing}</h2>
            </div>
          </div>
        </div>

        <div className='col'>
          <div className='p-3 rounded-4 report-container' style={{ backgroundColor: "white", borderColor: "black", border: "1px solid" }}>
            <div className='w-100 gap-1 pt-3 pb-0'>
              <p className='p-0 m-0' style={{
                fontSize: "20px",
                fontWeight: 600,
              }}>Completed Orders</p>
              <h2 className='p-0 text-end report-count'>{Data && Data.count?.totalCompleted}</h2>
            </div>
          </div>
        </div>

        <div className='col'>
          <div className='p-3 rounded-4 report-container' style={{ backgroundColor: "white", borderColor: "black", border: "1px solid" }}>
            <div className='w-100 gap-1 pt-3 pb-0'>
              <p className='p-0 m-0' style={{
                fontSize: "20px",
                fontWeight: 600,
              }}>Cancelled Orders</p>
              <h2 className='p-0 text-end report-count'>{Data && Data.count?.totalCancelled}</h2>
            </div>

          </div>
        </div>
      </div>


      <div className='w-100 row row-cols-1 row-cols-xxl-2 gy-3 mt-4' style={{ height: "fit-content", flex: 1 }}>
        <div className='col'>
          <div className='h-100 d-flex flex-column gap-3'>
            <List
              header={<div style={{
                fontSize: "20px",
                fontWeight: 600,
              }}>Best Seller</div>}
              bordered
              className='bg-white h-50'
              dataSource={Data.bestClothSeller}
              renderItem={(item) => (
                <List.Item>
                  <div className='d-flex justify-content-between w-100' style={{
                    fontSize: "16px",
                    fontWeight: 400,
                  }}>
                    <div>{item.cloth} #{item.id}</div>
                    <div>{item.total}</div>
                  </div>
                </List.Item>
              )}
            />

            <List
              header={<div style={{
                fontSize: "20px",
                fontWeight: 600,
              }}>Best sell by category</div>}
              bordered
              className='bg-white h-50'
              dataSource={Data.bestSellersByCategory}
              renderItem={(item) => (
                <List.Item>
                  <div className='d-flex justify-content-between w-100' style={{
                    fontSize: "16px",
                    fontWeight: 400,
                  }}>
                    <div>{item.category.name}</div>
                    <div>{item.totalQuantitySold}</div>
                  </div>
                </List.Item>
              )}
            />
          </div>
        </div>
        <div className='col '>
          <div className='mt-3 mt-lg-0'>
            <div className='gap-3 p-4 rounded-4 h-100' style={{ backgroundColor: "white", borderColor: "black", border: "1px solid" }}>
              <p className='p-0 m-0' style={{
                fontSize: "20px",
                fontWeight: 600,
              }}>Monthly Sales</p>

              <div className='d-flex align-items-end h-100 pb-4'>
                <canvas id="acquisitions" className='w-100' style={{ minHeight: "400px" }}></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
