import { Card, LegacyStack, Text, Combobox, Listbox, Icon, Select, Page } from '@shopify/polaris';
import { SearchIcon } from '@shopify/polaris-icons';
import React, { useState, useCallback, useMemo, useEffect, useReducer } from 'react';
import "./style/hierarchy.css";
import Analytics from './Analytics';

const initialState = {
  selectedOption: "",
  inputValue: "",
  productData: []
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SELECTED_OPTION":
      return { ...state, selectedOption: action.payload };
    case "INPUT_VALUE":
      return { ...state, inputValue: action.payload };
    default:
    case "PRODUCTS_DATA":
      return { ...state, productData: action.payload }
  }
};

const Hierarchy = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [selected, setSelected] = useState('today');


  const deselectedOptions = useMemo(
    () => [
      { value: 'tags', label: 'Tags' },
      { value: 'product type', label: 'Product Type' },
      // { value: 'collection', label: 'Collection' },
    ],
    []
  );

  const escapeSpecialRegExCharacters = useCallback(
    (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
    []
  );
  const [options, setOptions] = useState(deselectedOptions);


  const updateText = (value) => {
    dispatch({ type: "INPUT_VALUE", payload: value });

    if (value === '') {
      setOptions(deselectedOptions);
      return;
    }

    const filterRegex = new RegExp(escapeSpecialRegExCharacters(value), 'i');
    const resultOptions = deselectedOptions.filter((option) =>
      option.label.match(filterRegex)
    );
    setOptions(resultOptions);
  };

  const updateSelection = (selected) => {
    console.log("selected ==== ", selected);
    fetchProductsFunction(selected);

    const matchedOption = options.find((option) => option.value === selected);
    dispatch({ type: "SELECTED_OPTION", payload: selected });
    dispatch({ type: "INPUT_VALUE", payload: matchedOption?.label || '' });
  }


  const optionsMarkup = options.map(({ label, value }) => (
    <Listbox.Option
      key={value}
      value={value}
      selected={state.selectedOption === value}
      accessibilityLabel={label}
    >
      {label}
    </Listbox.Option>
  ));

  const handleSelectChange = async (value) => {
    console.log("value ====== ", value);
    setSelected(value)
    try {
      const response = await fetch(`/api/mainCategory`, {
        method: "POST",
        headers: {
          "Content-Type": "application.json"
        },
        body: JSON.stringify({
          categoryType: state.selectedOption,
          categoryName: value
        })
      });
      const data = await response.json();
      console.log("Fetched products: ", data);

    } catch (error) {
      console.error("Error fetching products: ", error);
    }


  }


  const fetchProductsFunction = async (categoryName) => {
    try {
      const response = await fetch("/api/productsFetch", {
        method: "POST",
        headers: {
          "Content-Type": "application.json"
        },
        body: JSON.stringify({ categoryName })
      });
      const data = await response.json();
      console.log("Fetched products: ", data);
      dispatch({ type: "PRODUCTS_DATA", payload: data })
    } catch (error) {
      console.error("Error fetching products: ", error);
    }
  };


  return (
    <>
      <div className='hierarchy-container'>
        <Card>
          <div className='hierarchy-headings'>
            <Text variant="heading2xl" as="h2">Custom Hierarchy</Text>
          </div>

          <div className='main-container'>
            <Card>
              <div className='main-category'>
                <Text variant="headingLg" as="h5">
                  Step 1: Select Main Category
                </Text>

                <Combobox
                  activator={
                    <Combobox.TextField
                      prefix={<Icon source={SearchIcon} />}
                      onChange={updateText}
                      value={state.inputValue}
                      placeholder="Search Categories"
                      autoComplete="off"
                    />
                  }
                >
                  {options.length > 0 ? (
                    <Listbox onSelect={updateSelection}>{optionsMarkup}</Listbox>
                  ) : null}
                </Combobox>
              </div>
            </Card>


            <Card>
              <div className='main-category'>
                <Text variant="headingLg" as="h5">
                  Step 2: Select the {state.selectedOption} from the list
                </Text>

                <Select
                  disabled={!state.selectedOption}
                  options={[
                    { value: '', label: `Select ${state.selectedOption}`, disabled: true },
                    ...state.productData.map((item) => ({
                      value: item.value || item,
                      label: item.label || item,
                    })),
                  ]}
                  onChange={handleSelectChange}
                  value={selected}
                />


              </div>
            </Card>
          </div>
        </Card>
      </div>

      <div style={{ marginTop: "20px" }}>
        <Analytics />
      </div>

    </>
  );
};

export default Hierarchy;
