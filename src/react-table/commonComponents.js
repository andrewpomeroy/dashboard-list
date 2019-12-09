import styled from "@emotion/styled/macro";
import colors from './colors';

export const Username = styled.span`
  font-weight: 600;
  color: ${colors.primary};
`

export const UnassignedUser = styled.span`
  font-weight: 600;
  font-style: italic;
  color: ${colors.mutedText};
`

export const PrimaryText = styled.span`
  color: ${colors.strongText};
  font-weight: 600;
`