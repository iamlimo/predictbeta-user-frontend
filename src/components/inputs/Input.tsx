import styled from "styled-components";

export const Input = styled.input`
	border: 1px solid #dbdfe6;
	border-radius: 4px;
	padding: 10px 16px;
	color: var(--primary-black);
	background: #f5f6f8;
	font-size: 14px;

	&:focus,
	&:focus-visible,
	&_no-border:focus,
	&_no-border:focus-visible,
	&:focus-visible,
	&:focus {
		outline-color: var(--predictbeta-blue);
	}

	&::placeholder {
		color: var(--neutral-ash);
	}

	&.invalid {
		border-color: var(--alert-red);
		background: #d52a2a40;

		&::placeholder {
			color: #eb1536;
		}
	}

	&:disabled {
		background: #f5f6f8;
		color: #8c97a7;
		&:hover {
			cursor: not-allowed;
		}
	}
`;

export const InputPlaceholder = styled.div`
	border: 1px solid #dbdfe6;
	border-radius: 4px;
	padding: 10px 16px;
	color: var(--primary-black);
	background: #f5f6f8;
	font-size: 14px;
`;
