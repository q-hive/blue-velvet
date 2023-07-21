import React from "react";

//*MUI Components
import {
  Box,
  Table,
  TableRow,
  TableCell,
  Typography,
  styled,
  TableHead,
  TableBody,
  tableCellClasses,
  TableContainer,
  Paper,
} from "@mui/material";

//*UTILS

//THEME
import { BV_THEME } from "../../../../theme/BV-theme";

const taskCard_sx = {
  display: "flex",
  width: "100%",
  justifyContent: "center",
  marginTop: "5vh",
  flexDirection: "column",
  alignItems: "center",
};

export const PackingContent = (props) => {
  let packs = props.packs;
  console.log("packs in packing content: ", packs);
  let totalPacks = {
    products: { packages: { small: 0, medium: 0, large: 0 } },
  };
  const getPackagesInGrams = (packagesObject) => {
    let small = 25 * packagesObject["small"];
    let medium = 80 * packagesObject["medium"];
    let large = 1000 * packagesObject["large"];
    let total = small + medium + large;

    return {
      small: small,
      medium: medium,
      large: large,
      total: total,
    };
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#93cf0f",
      color: BV_THEME.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: "#E8F7C8",
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  if (packs?.length > 0) {
    totalPacks = props.packs.reduce(
      (current, past) => {
        if (current && past) {
          let currentSmall = current[Object.keys(current)[0]].packages.small;
          let pastSmall = past[Object.keys(past)[0]].packages.small;

          let currentMedium = current[Object.keys(current)[0]].packages.medium;
          let pastMedium = past[Object.keys(past)[0]].packages.medium;

          let currentLarge = current[Object.keys(current)[0]].packages.large;
          let pastLarge = past[Object.keys(past)[0]].packages.large;

          return {
            products: {
              packages: {
                small: currentSmall + pastSmall,
                medium: currentMedium + pastMedium,
                large: currentLarge + pastLarge,
              },
            },
          };
        }
      },
      { products: { packages: { small: 0, medium: 0, large: 0 } } }
    );
  }

  if (props.index === 0)
    return (
      <>
        <Box sx={taskCard_sx}>
          <Typography
            variant="h5"
            align="center"
            color={BV_THEME.textColor.lightGray}
          >
            {packs && packs.length > 0 ? (
              <TableContainer component={Paper}>
                <Table sx={{}}>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell width="34%">
                        <Typography variant="subtitle1"> Product </Typography>
                      </StyledTableCell>
                      <StyledTableCell width="25%" align="right">
                        <Typography variant="subtitle1">
                          {" "}
                          Large (1kg){" "}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell width="25%" align="right">
                        <Typography variant="subtitle1">
                          {" "}
                          Medium (80 gr){" "}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell width="25%" align="right">
                        <Typography variant="subtitle1">
                          {" "}
                          Small (25 gr){" "}
                        </Typography>
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {packs.map((pack) => {
                      return (
                        <>
                          <StyledTableRow key={Object.keys(pack)[0]}>
                            <StyledTableCell component="th" scope="row">
                              <b>{Object.keys(pack)[0]}:</b>
                            </StyledTableCell>
                            <StyledTableCell align="right">
                              {pack[Object.keys(pack)[0]].packages.large}
                              <br></br>
                            </StyledTableCell>
                            <StyledTableCell align="right">
                              {pack[Object.keys(pack)[0]].packages.medium}{" "}
                              <br></br>
                            </StyledTableCell>
                            <StyledTableCell align="right">
                              {pack[Object.keys(pack)[0]].packages.small}
                              <br></br>
                            </StyledTableCell>
                          </StyledTableRow>

                          <br></br>
                        </>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography
                variant="h5"
                align="center"
                color={BV_THEME.textColor.lightGray}
              >
                Total packages:
                <br></br>
                Small: {0} <br></br>
                Medium: {0} <br></br>
              </Typography>
            )}
            <b>
              <i>
                Click finish task when all the packages are ready for delivery.
                Also make sure there are no greens on the side of the container when
                closing
              </i>
            </b>
          </Typography>
        </Box>
      </>
    );
};
