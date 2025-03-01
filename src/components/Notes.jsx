import './Notes.css';

export const Notes = () => {
  return (
    <div className="notes-section" data-section="notes">
      <div className="notes-container">
        <div className="note">
          <h3 className="note-heading">Gross Salary Calculation</h3>
          <p>
            The gross salary figure displayed in the worker row does not include employer pension contributions.
            It represents the base salary adjusted for uplifts and days per week.
          </p>
        </div>

        <div className="note">
          <h3 className="note-heading">Uplift Hierarchy</h3>
          <p>
            Uplift rows can be dragged right to create a two-level hierarchy.
            Use Alt+Right Arrow to indent an uplift, and Alt+Left Arrow to outdent.
          </p>
        </div>
      </div>
    </div>
  );
};
