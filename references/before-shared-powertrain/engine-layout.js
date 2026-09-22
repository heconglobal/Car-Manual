// Reconstructed stagger of the paired cylinder banks. This offset is a
// placement estimate, not a Pontiac dimension. Use the same datum for bores,
// pistons, heads, intake/exhaust ports and ignition endpoints so parts fit.
export const reconstructedBankOffset=.013;
export const bankOffset=side=>side*reconstructedBankOffset;
