package com.fing.backend.entity;

import com.fing.backend.enumerate.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;
import org.hibernate.Hibernate;
import javax.persistence.Entity;
import javax.persistence.Transient;
import java.util.Objects;

@Getter
@Setter
@ToString
@Entity
@SuperBuilder(toBuilder = true)
@AllArgsConstructor
public class Administrator extends User {

    @Transient
    private final UserRole role = UserRole.ADMIN;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        Administrator that = (Administrator) o;
        return getId() != null && Objects.equals(getId(), that.getId());
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}