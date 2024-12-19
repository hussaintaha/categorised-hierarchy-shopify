import React, { useEffect, useState } from 'react';
import { Text, ChoiceList, Card, Page } from '@shopify/polaris';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import "./style/analytics.css"

const Analytics = () => {
  const [selected, setSelected] = useState([]);
  const [chartData, setChartData] = useState([]);

  const handleChange = (value) => {
    setSelected(value);
  };

  useEffect(() => {
    if (selected.length > 0) {
      fetchData();
    }
  }, [selected]);

  const fetchData = async () => {
    try {
      const getJSONdata = await fetch(`/api/getAnalytics/${selected}`);
      const jsonResponse = await getJSONdata.json();

      if (jsonResponse.status) {
        const response = jsonResponse.data;

        let transformedData = response.data.map(category => {
          const categoryName = category.categoryName
          const totalProducts = category.products.length;

          const totalPrice = category.products.reduce((acc, product) => {
            const price = product.node.variants.edges.reduce((total, variant) => total + parseFloat(variant.node.price), 0);
            return acc + price;
          }, 0);
          const averagePrice = totalPrice / totalProducts

          return {
            name: categoryName,
            total_products: totalProducts,
            averagePrice: averagePrice.toFixed(2)
          };
        });

        setChartData(transformedData)
      }
    } catch (error) {
      console.log("error in analytics", error);
    }
  };



  return (
    <div className='analytics-container'>
      <Card>
        <div className='analytics-headings'>
          <Text variant="heading2xl" as="h2"> Analytics </Text>
        </div>

        <div className='choiseList'>

          <Text variant="headingLg" as="h5"> Select Category to display analytics </Text>
          <ChoiceList
            // title="Select Category to display analytics"
            choices={[
              { label: 'Tags', value: 'tags' },
              { label: 'Product Type', value: 'producttype' },
            ]}
            selected={selected}
            onChange={handleChange}
          />
        </div>

        {chartData.length > 0 && (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip contentStyle={{ backgroundColor: "#f5f5f5", borderRadius: "5px" }} />
              <Legend />
              <Bar dataKey="total_products" fill="#5c6bc0" />
              <Bar dataKey="averagePrice" fill="#ff7043" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>
    </div>
  );
};

export default Analytics;
