import {v6BlockNominal} from './factory-specifications.js';
// GM figure 11: the odd-numbered bank is 44 mm nearer the pulley end.
// Legacy +X points toward the flywheel, so that bank has negative offset.
export const bankOffset=side=>-side*v6BlockNominal.bankStagger/2;
// The former head/cover stack was 90 mm too far along the cylinder axis.
// Reposition complete components; never stretch the installed version.
export const headStackCorrection=.09;
export const upperEngineDrop=headStackCorrection*Math.cos(Math.PI/6);
