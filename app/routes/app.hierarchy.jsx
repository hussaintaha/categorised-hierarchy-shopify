import { Box, Card, LegacyStack, Page, Text, useFrame } from '@shopify/polaris'
import { Listbox, Combobox, Icon } from '@shopify/polaris';
import { SearchIcon } from '@shopify/polaris-icons';
import React, { useState, useCallback, useMemo, useEffect } from 'react';

const Hierarchy = () => {

  const deselectedOptions = useMemo(
    () => [
      { value: 'rustic', label: 'Rustic' },
      { value: 'antique', label: 'Antique' },
      { value: 'vinyl', label: 'Vinyl' },
      { value: 'vintage', label: 'Vintage' },
      { value: 'refurbished', label: 'Refurbished' },
    ],

  );


  const [selectedOption, setSelectedOption] = useState()
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState(deselectedOptions);

  const escapeSpecialRegExCharacters = useCallback(
    (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
    [],
  );

  const updateText = (value) => {
    setInputValue(value);

    if (value === '') {
      setOptions(deselectedOptions);
      return;
    }

    const filterRegex = new RegExp(escapeSpecialRegExCharacters(value), 'i');
    const resultOptions = deselectedOptions.filter((option) =>
      option.label.match(filterRegex),
    );
    setOptions(resultOptions);

  }

  // const updateText = useCallback(
  //   (value) => {
  //     setInputValue(value);

  //     if (value === '') {
  //       setOptions(deselectedOptions);
  //       return;
  //     }

  //     const filterRegex = new RegExp(escapeSpecialRegExCharacters(value), 'i');
  //     const resultOptions = deselectedOptions.filter((option) =>
  //       option.label.match(filterRegex),
  //     );
  //     setOptions(resultOptions);
  //   },
  //   [deselectedOptions, escapeSpecialRegExCharacters],
  // );

  const updateSelection = useCallback(
    (selected) => {
      const matchedOption = options.find((option) => {
        return option.value.match(selected);
      });

      setSelectedOption(selected);
      setInputValue((matchedOption && matchedOption.label) || '');
    },
    [options],
  );


  const optionsMarkup =
    options.length > 0
      ? options.map((option) => {
        const { label, value } = option;

        return (
          <Listbox.Option
            key={`${value}`}
            value={value}
            selected={selectedOption === value}
            accessibilityLabel={label}
          >
            {label}
          </Listbox.Option>
        );
      })
      : null;


  const fetchProductsFunction = async () => {
    try {
      const fetchProducts = await fetch("/api/productsFetch");
      console.log("fetchProducts ==== ", await fetchProducts.json());

    } catch (error) {
      console.log("error in fetchProductsFunction", error);
      return error
    }
  }

  useEffect(() => {
    fetchProductsFunction();
  }, [])



  return (
    <>
      <Card>
        <LegacyStack>
          <Text variant="heading3xl" as="h2">
            Custom Hierarchy
          </Text>
        </LegacyStack>

        <Box>
          <Combobox
            activator={
              <Combobox.TextField
                prefix={<Icon source={SearchIcon} />}
                onChange={updateText}
                label="Search Categories"
                labelHidden
                value={inputValue}
                placeholder="Search Categories"
                autoComplete="off"
              />
            }
          >
            {options.length > 0 ? (
              <Listbox onSelect={updateSelection}>{optionsMarkup}</Listbox>
            ) : null}
          </Combobox>
        </Box>

      </Card>
    </>

  )
}

export default Hierarchy
