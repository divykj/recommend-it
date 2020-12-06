import { Row, AutoComplete, Button, Col } from "@geist-ui/react";
import { useCallback, useState } from "react";
import axios from "axios";
import serverAPI from "./config";

const SearchForm = ({ onSelected }) => {
  const [autoCompleteState, setAutoCompleteState] = useState({
    value: "",
    options: [],
    searching: false,
  });

  // const handleSelect = useCallback(
  //   (value) => {
  //     alert(value);
  //     const selected = autoCompleteState.options.find(
  //       (option) => option.value === value
  //     );
  //     alert(selected);
  //   },
  //   [autoCompleteState.options]
  // );

  const handleChange = useCallback(
    async (value) => {
      const selectedOption = autoCompleteState.options.find(
        (option) => option.value === value
      );
      if (selectedOption) onSelected(selectedOption);

      if (selectedOption || !value) {
        setAutoCompleteState((oldAutoCompleteState) => ({
          ...oldAutoCompleteState,
          value: "",
          options: [],
          searching: false,
        }));
        return;
      }

      setAutoCompleteState((oldAutoCompleteState) => ({
        ...oldAutoCompleteState,
        value,
        searching: true,
      }));

      try {
        const { data } = await axios.get(`${serverAPI}/movies/?q=${value}`);
        const options = data
          .map(({ name, id, year }) => ({
            label: year ? `${name} (${year})` : name,
            value: year ? `${name} (${year})` : name,
            id,
          }))
          .sort((option1, option2) => {
            const option1StartsWithValue = option1.value.startsWith(value);
            const option2StartsWithValue = option2.value.startsWith(value);

            if (option1StartsWithValue && option2StartsWithValue)
              return option1.value.localeCompare(option2.value);
            if (option1StartsWithValue) return -1;
            if (option2StartsWithValue) return 1;

            return option1.value.localeCompare(option2.value);
          });
        console.log("GOT OPTIONS", options);
        setAutoCompleteState((oldAutoCompleteState) => ({
          ...oldAutoCompleteState,
          searching: false,
          options,
        }));
      } catch (err) {
        console.error(err);
        setAutoCompleteState((oldAutoCompleteState) => ({
          ...oldAutoCompleteState,
          searching: false,
        }));
      }
    },
    [onSelected, autoCompleteState.options]
  );

  return (
    <AutoComplete
      {...autoCompleteState}
      placeholder="Search movies..."
      onChange={handleChange}
      width="100%"
    />
  );
};

export default SearchForm;
