import { BRANCHES } from '../../utils/constants';
export default function BranchSelect({value,onChange}){return <select value={value} onChange={e=>onChange(e.target.value)}><option value="">Select your Engineering Branch</option>{BRANCHES.map(b=><option key={b}>{b}</option>)}</select>}
