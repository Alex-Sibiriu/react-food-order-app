export default function Input({ label, id, ...props }) {
	return (
		<div className="control">
			<label htmlFor={id}>{label}</label>
			<input {...props} id={id} />
		</div>
	);
}
